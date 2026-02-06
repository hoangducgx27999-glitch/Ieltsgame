export async function onRequestPost({ request, env }) {
  const { username, password } = await request.json();

  const user = await env.DB
    .prepare("SELECT * FROM users WHERE username = ? AND password = ?")
    .bind(username, password)
    .first();

  if (!user) {
    return new Response("Sai tài khoản", { status: 401 });
  }

  return new Response("OK");
}

