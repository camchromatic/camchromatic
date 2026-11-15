// Cloudflare Pages Function: GET /api/rcm-name?id=12345  ->  {"id":12345,"name":"Username"}
// Used by the BBCode Previewer to show a recolor.me username for a Citizen ID.
// recolor.me shares this publicly at /get/account/ID, but its replies can't be read by
// pages on other websites, so this small helper asks for them and passes back only the name.
// Replies are cached for an hour so recolor.me isn't asked again for every keystroke.

export async function onRequest(context) {
  const { request } = context;
  if (request.method !== "GET") return json({ error: "GET only" }, 405);

  const id = new URL(request.url).searchParams.get("id") || "";
  if (!/^\d{1,9}$/.test(id)) return json({ error: "Citizen ID must be a number" }, 400);

  let name = null;
  try {
    const res = await fetch("https://recolor.me/get/account/" + id, {
      headers: { "Accept": "application/json" },
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (res.ok) {
      const data = JSON.parse(await res.text());
      if (data && data.account && typeof data.account.name === "string") name = data.account.name;
    }
  } catch (e) {
    return json({ error: "recolor.me didn't answer" }, 502, 60);
  }

  if (!name) return json({ id: Number(id), name: null }, 404, 600);
  return json({ id: Number(id), name: name.slice(0, 40) }, 200, 3600);
}

function json(body, status, maxAge) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": maxAge ? "public, max-age=" + maxAge : "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
