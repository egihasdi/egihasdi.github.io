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
  "/css/code_theme.css",
  "https://cdn.jsdelivr.net/npm/@catppuccin/highlightjs@0.2.2/css/catppuccin-mocha.css",
);

site.copy("/css/code_theme.css"); // Cop

site.use(
  codeHighlight({
    languages: {
      javascript: lang_js,
    },
  }),
);


site.use(postcss());

export default site;
