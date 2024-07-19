import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import catppuccin from "npm:@catppuccin/tailwindcss";
import typography from "npm:@tailwindcss/typography";
import codeHighlight from "lume/plugins/code_highlight.ts";
import lang_js from "npm:highlight.js/lib/languages/javascript";
import { full as emoji } from "npm:markdown-it-emoji";
import { ObsidianLink } from "./lib/obsidian/index.ts";
import modifyUrls from "lume/plugins/modify_urls.ts";
import pagefind from "lume/plugins/pagefind.ts";
import footnote from "npm:markdown-it-footnote";
import externalLinks from "npm:markdown-it-external-links";

import remark from "lume/plugins/remark.ts";
import remarkObsidian from "npm:remark-obsidian";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import { titleToUrl } from "./lib/titleToUrl.ts";
import { join } from "jsr:@std/path";
import rehypePresetMinify from "npm:rehype-preset-minify@7";
import remarkGfm from "npm:remark-gfm";
import minifyHTML from "lume/plugins/minify_html.ts";


const site = lume(
  {},
  // {
  //   markdown: {
  //     options: {
  //       linkify: true,
  //     },
  //   },
  // },
);

// site.hooks.addMarkdownItPlugin(emoji);
// site.hooks.addMarkdownItPlugin(ObsidianLink, {
//   baseUrl: "/notes/",
// });
// site.hooks.addMarkdownItPlugin(footnote);
// site.hooks.addMarkdownItPlugin(externalLinks, {
//   internalDomains: ["egihasdi.github.io"],
//   externalTarget: "_blank",
// });
//

site.use(minifyHTML());
site.use(
  remark({
    sanitize: true,
    rehypePlugins: [rehypePresetMinify],
    rehypeOptions: {
      allowDangerousHtml: true,
    },
    remarkPlugins: [
      remarkGfm,
      [
        remarkObsidian,
        {
          titleToUrl,
          markdownFolder: join(Deno.cwd(), "notes"),
        },
      ],
    ],
  }),
);

site.use(slugifyUrls());

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
site.copy("/notes/assets/imgs", "assets/imgs");

site.use(
  modifyUrls({
    fn(url) {
      if (url.startsWith("assets/imgs")) {
        return "/" + url;
      }
      return url;
    },
  }),
);

site.use(
  codeHighlight({
    languages: {
      javascript: lang_js,
    },
  }),
);

site.use(pagefind());

site.use(postcss());

export default site;
