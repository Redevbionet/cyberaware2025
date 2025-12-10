export function GET(request) {
  if (isBetaUser(request)) {
	return new Response("👋 Beta User");
  }
  return new Response("👋 User");
}
