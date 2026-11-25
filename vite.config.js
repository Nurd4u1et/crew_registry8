import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

function serviceWorkerPlugin() {
  return {
    name: "crew-registry-service-worker",
    apply: "build",
    generateBundle(_, bundle) {
      const precache = [...new Set([
        ...Object.keys(bundle).filter((file) => file === "index.html" || file.startsWith("assets/")),
        "/",
        "index.html",
        "manifest.webmanifest",
        "offline.html",
        "favicon.svg",
        "icons/icon-192.png",
        "icons/icon-512.png",
      ])];
      const template = readFileSync("src/sw.template.js", "utf8");
      const outputFingerprint = Object.keys(bundle).sort().map((file) => {
        const item = bundle[file];
        const contents = item.type === "chunk" ? item.code : item.source;
        return `${file}:${contents}`;
      }).join("\n");
      const publicFingerprint = ["manifest.webmanifest", "offline.html", "favicon.svg", "icons/icon-192.png", "icons/icon-512.png"]
        .map((file) => `${file}:${readFileSync(`public/${file}`)}`)
        .join("\n");
      const version = createHash("sha256")
        .update(template)
        .update(readFileSync("index.html"))
        .update(outputFingerprint)
        .update(publicFingerprint)
        .update(JSON.stringify(precache))
        .digest("hex")
        .slice(0, 10);
      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: template
          .replace("__APP_VERSION__", version)
          .replace("__PRECACHE_URLS__", JSON.stringify(precache.map((url) => url === "/" ? url : `/${url}`))),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), serviceWorkerPlugin()],
});

