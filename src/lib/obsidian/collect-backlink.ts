import { tokenize } from "./plugin.ts";
import { extract } from "jsr:@std/front-matter/yaml";
import createSlugifier, {
  defaults as slugifierDefaults,
} from "lume/core/slugifier.ts";

const slugify = createSlugifier(slugifierDefaults);

function markdownItCollectBacklinks(md, options = {}) {
  const backlinks = options.backlinks || {};

  // Collect backlinks from each note
  function collectBacklinks(state) {
    const result = extract(state.src);
    const alias = result.attrs.aliases[0];
    const id = result.attrs.id;
    const slug = `${slugify(alias)}`;
    const data = { alias, slug, id }

    if (result.attrs.isPost === false) {
      return
    }

    state.tokens.forEach((blockToken) => {
      if (blockToken.type === "inline" && blockToken.children) {
        blockToken.children.forEach((token) => {
          if (token.type === "wikilink") {
            const targetId = token.content.split("|")[0]
            if (!backlinks[targetId]) {
              backlinks[targetId] = [];
            }
            if (!backlinks[targetId].some(x => x.id === id)) {
              backlinks[targetId].push(data);
            }
          }
        });
      }
    });
  }

  // Define wikilink token type
  md.inline.ruler.after("link", "wikilink", tokenize);
  md.core.ruler.push("collect_backlinks", collectBacklinks);
}

export default markdownItCollectBacklinks;
