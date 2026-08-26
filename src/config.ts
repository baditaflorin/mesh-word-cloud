import { createMeshConfig } from "@baditaflorin/mesh-common";

export const config = createMeshConfig({
  appName: "mesh-word-cloud",
  breadcrumbs: false,
  displayName: "Room Words",
  description: "A shared one-word reflection cloud for live groups.",
  visualProfile: "gather",
  shellLayout: "inset",
  accentHex: "#92f0e2",
  version: __APP_VERSION__,
  commit: __GIT_COMMIT__,
});
