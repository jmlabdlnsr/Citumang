export function GET(request: Request) {
  return Response.redirect(new URL("/id", request.url), 307);
}
