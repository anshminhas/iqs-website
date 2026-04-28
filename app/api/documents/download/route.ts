// This route is no longer used.
// Downloads are handled directly via Cloudinary fl_attachment transformation URLs.
export async function GET() {
  return new Response('Not used', { status: 404 });
}
