import { createMeshConfig } from "@baditaflorin/mesh-common";

export const config = createMeshConfig({
  appName: "mesh-word-cloud",
  description: "A shared one-word reflection cloud for live groups.",
  accentHex: "#0f766e",
  version: __APP_VERSION__,
  commit: __GIT_COMMIT__,
});
