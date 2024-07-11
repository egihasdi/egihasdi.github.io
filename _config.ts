import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import catppuccin from "npm:@catppuccin/tailwindcss";
import typography from "npm:@tailwindcss/typography";
import codeHighlight from "lume/plugins/code_highlight.ts";

import lang_js from "npm:highlight.js/lib/languages/javascript";

const site = lume();

site.use(
  tailwindcss({
    options: {
      plugins: [
        catppuccin({
          prefix: false,
          defaultFlavour: "mocha",
        }),
        typography,
      ],
    },
  }),
);

site.remoteFile(
  "_includes/css/code_theme.css",
  "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/styles/github-dark.min.css",
);

site.use(
  codeHighlight({
    theme: {
      name: "atom-one-dark", // The theme name to download
      path: "/css/code_theme.css", // The destination filename
    },
    languages: {
      javascript: lang_js,
    },
  }),
);

site.copy("/css/code_theme.css"); // Cop

site.use(postcss());

export default site;
