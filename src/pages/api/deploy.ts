import type { APIRoute } from 'astro';

const DEPLOY_HOOK_URL = 'https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/8d600d74-e2b0-425e-a0eb-461437da6479';

export const POST: APIRoute = async () => {
  try {
    const res = await fetch(DEPLOY_HOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Deploy hook error: ${res.status}`);
    }

    const data = await res.json();

    return new Response(
      JSON.stringify({ success: true, message: 'Deploy iniciado', build_uuid: data.build_uuid }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Error al iniciar deploy',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
