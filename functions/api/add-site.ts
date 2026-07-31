interface AddSiteBody {
  name: string;
  url: string;
  description?: string;
}

interface SiteEntry {
  slug: string;
  name: string;
  url: string;
  description?: string;
  addedAt: string;
}

interface Env {
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const GITHUB_API = "https://api.github.com";

async function getFile(repo: string, filePath: string, token: string) {
  const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${filePath}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "qa-dashboard",
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<{ sha: string; content: string }>;
}

async function commitFile(
  repo: string,
  filePath: string,
  content: string,
  message: string,
  token: string,
  sha?: string
) {
  const body: Record<string, unknown> = {
    message,
    content: btoa(content),
  };

  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "qa-dashboard",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GitHub commit error: ${res.status} ${error}`);
  }

  return res.json();
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const token = env.GITHUB_TOKEN;
  const repo = env.GITHUB_REPO;

  if (!token || !repo) {
    return new Response(
      JSON.stringify({ error: "Server misconfigured: missing GITHUB_TOKEN or GITHUB_REPO" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body: AddSiteBody = await request.json();

    if (!body.name?.trim()) {
      return new Response(JSON.stringify({ error: "Nombre es requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!body.url?.trim()) {
      return new Response(JSON.stringify({ error: "URL es requerida" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      new URL(body.url);
    } catch {
      return new Response(JSON.stringify({ error: "URL no válida" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const slug = generateSlug(body.name);

    const fileData = await getFile(repo, "public/sites.json", token);
    const currentSha = fileData.sha;
    const sites: SiteEntry[] = JSON.parse(atob(fileData.content));

    if (sites.some((s) => s.slug === slug)) {
      return new Response(
        JSON.stringify({ error: `Ya existe un sitio con el slug "${slug}"` }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    const newSite: SiteEntry = {
      slug,
      name: body.name.trim(),
      url: body.url.trim(),
      description: body.description?.trim(),
      addedAt: new Date().toISOString(),
    };

    sites.push(newSite);

    const updatedContent = JSON.stringify(sites, null, 2) + "\n";
    await commitFile(
      repo,
      "public/sites.json",
      updatedContent,
      `add site: ${newSite.name} (${slug})`,
      token,
      currentSha
    );

    return new Response(JSON.stringify({ success: true, slug, site: newSite }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error adding site:", err);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
