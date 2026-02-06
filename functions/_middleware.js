export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  // cho phép login
  if (url.pathname === "/login" || url.pathname === "/login.html") {
    return next();
  }

  // kiểm tra cookie
  const cookie = request.headers.get("cookie") || "";
  if (!cookie.includes("ok=1")) {
    return Response.redirect(new URL("/login.html", url), 302);
  }

  return next();
}
