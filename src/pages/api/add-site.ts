import type { APIRoute } from 'astro';

const GITHUB_REPO = 'OMGCarolina/qa-dashboard';
const SITES_FILE_PATH = 'src/data/sites.json';
const GITHUB_API = 'https://api.github.com';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const POST: APIRoute = async ({ request, locals }) => {
  const token = (locals as any).runtime.env.GITHUB_TOKEN;

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'GITHUB_TOKEN no configurado' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { name?: string; url?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'JSON inválido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const name = body.name?.trim();
  const url = body.url?.trim();
  const description = body.description?.trim() || undefined;

  if (!name || !url) {
    return new Response(
      JSON.stringify({ error: 'Nombre y URL son obligatorios' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const slug = generateSlug(name);

  try {
    const fileRes = await fetch(
      `${GITHUB_API}/repos/${GITHUB_REPO}/contents/${SITES_FILE_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!fileRes.ok) {
      throw new Error(`Error leyendo archivo: ${fileRes.status}`);
    }

    const fileData = await fileRes.json() as { content: string; sha: string };
    const sites = JSON.parse(
      decodeURIComponent(escape(atob(fileData.content)))
    );

    if (sites.some((s: { slug: string }) => s.slug === slug)) {
      return new Response(
        JSON.stringify({ error: `Ya existe un sitio con el slug "${slug}"` }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    sites.push({
      slug,
      name,
      url,
      description,
      addedAt: new Date().toISOString(),
    });

    const updatedContent = JSON.stringify(sites, null, 2) + '\n';

    const commitRes = await fetch(
      `${GITHUB_API}/repos/${GITHUB_REPO}/contents/${SITES_FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `add site: ${name} (${slug})`,
          content: btoa(unescape(encodeURIComponent(updatedContent))),
          sha: fileData.sha,
        }),
      }
    );

    if (!commitRes.ok) {
      const err = await commitRes.text();
      throw new Error(`Error commitando: ${commitRes.status} ${err}`);
    }

    return new Response(
      JSON.stringify({ success: true, slug, name }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Error desconocido',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
