import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import catppuccin from "npm:@catppuccin/tailwindcss";
import typography from "npm:@tailwindcss/typography";
import codeHighlight from "lume/plugins/code_highlight.ts";
import lang_js from "npm:highlight.js/lib/languages/javascript";
import { full as emoji } from "npm:markdown-it-emoji";
import { ObsidianLink } from "./src/lib/obsidian/index.ts";
import mdItBacklinks from "./src/lib/obsidian/backlink.ts";
import modifyUrls from "lume/plugins/modify_urls.ts";
import pagefind from "lume/plugins/pagefind.ts";
import footnote from "npm:@egihasdi/markdown-it-footnote@4.0.1";
import externalLinks from "npm:markdown-it-external-links";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import date from "lume/plugins/date.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import { collectBacklinksFromFiles } from "./src/lib/obsidian/collectBacklinksFromFiles.ts";
import { format } from "npm:date-fns"


const backlinks = await collectBacklinksFromFiles("./src/notes");

const site = lume(
  {
    src: './src'
  },
  {
    markdown: {
      options: {
        linkify: true,
      },
    },
  },
);

site.hooks.addMarkdownItPlugin(emoji);
site.hooks.addMarkdownItPlugin(mdItBacklinks, { backlinks });
site.hooks.addMarkdownItPlugin(ObsidianLink, {
  baseUrl: "src/notes/",
});


site.hooks.addMarkdownItPlugin(footnote);
site.hooks.addMarkdownItPlugin(externalLinks, {
  internalDomains: ["egihasdi.github.io"],
  externalTarget: "_blank",
});

site.filter("dateFromId", (value) => {
  const [time] = value.split('-')
  const d = new Date(Number(time) * 1000)

  return format(d, 'PPP')
});

site.use(slugifyUrls());
site.use(minifyHTML());

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
  "css/code_theme.css",
  "https://cdn.jsdelivr.net/npm/@catppuccin/highlightjs@0.2.2/css/catppuccin-mocha.css",
);

site.copy("css/code_theme.css"); // Cop
site.copy("notes/assets/imgs", "assets/imgs");

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

site.use(date());

site.use(readingInfo());

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
