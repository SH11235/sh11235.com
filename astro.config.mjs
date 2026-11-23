import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { urlEmbeds } from "./src/markdown/url-embeds.mjs";

export default defineConfig({
  site: "https://sh11235.com",
  integrations: [
    sitemap(),
    {
      name: "url-embeds",
      hooks: {
        "astro:config:setup": ({ config }) => {
          // Astro's default Sätteri processor is already available here.
          config.markdown.processor.options.mdastPlugins.push(
            urlEmbeds(new URL("content/articles/", config.srcDir)),
          );
        },
      },
    },
  ],
});
