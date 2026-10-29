import type { LoaderFunctionArgs } from "react-router";
import { getGuestApiClient } from "@jupiter/core/infra/api-clients.server";
import { serveImage } from "@jupiter/core/images/serve-image.server";

// The images the WebAPI keeps on its own disk, for stores a browser can't read.
// The links to them are relative (`/images/<purpose>/<path>`), so they resolve
// against whichever server the app is talking to. With a public bucket these
// links go straight to Google and never come here.
export async function loader({ request, params }: LoaderFunctionArgs) {
  return serveImage(await getGuestApiClient(request), params["*"]);
}
