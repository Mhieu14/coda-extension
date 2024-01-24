import { defineManifest } from "@crxjs/vite-plugin";

import packageData from "../package.json";

const isDev = process.env.NODE_ENV == "development";

const name = "Coda Extension";

export default defineManifest({
  manifest_version: 3,
  name: `${name}${isDev ? ` ➡️ Dev` : ""}`,
  version: packageData.version,
  description: "Empower non-Doc-Makers to create/update Coda pages.",
  icons: {
    16: "assets/icon/icon-16.png",
    32: "assets/icon/icon-32.png",
    48: "assets/icon/icon-48.png",
    128: "assets/icon/icon-128.png",
    256: "assets/icon/icon-256.png",
  },
  action: {
    default_popup: "popup.html",
    default_icon: "assets/icon/icon-48.png",
  },
  options_page: "settings.html",
  content_scripts: [
    {
      matches: ["https://coda.io/*"],
      js: ["src/content.ts"],
      all_frames: false,
      run_at: "document_start",
    },
  ],
  permissions: ["storage", "tabs"],
});
