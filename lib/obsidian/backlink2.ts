import { titleToUrl } from "./titleToUrl.ts";
function markdownItBacklinks(md, options = {}) {
  const backlinks = {};

  // Collect backlinks from each note
  function collectBacklinks(state) {
    const env = state.env;
    const fileName = env.filename || "unknown";

    state.tokens.forEach((blockToken) => {
      if (blockToken.type === "inline" && blockToken.children) {
        blockToken.children.forEach((token) => {
          if (token.type === "wikilink") {
            const targetFile = token.content.split("|")[0];
            if (!backlinks[targetFile]) {
              backlinks[targetFile] = [];
            }
            if (!backlinks[targetFile].includes(fileName)) {
              backlinks[targetFile].push(fileName);
            }
          }
        });
      }
    });
  }

  // Render backlinks at the end of the document
  function renderBacklinks(state) {
    const env = state.env;
    const id = env.data.id || "unknown";
    const backlinkList = backlinks[id];

    if (backlinkList && backlinkList.length > 0) {
      const sectionOpen = new state.Token("paragraph_open", "p", 1);
      const sectionTitle = new state.Token("inline", "", 0);
      sectionTitle.content = "Backlinks:";
      sectionTitle.children = [];
      const sectionClose = new state.Token("paragraph_close", "p", -1);

      const listOpen = new state.Token("bullet_list_open", "ul", 1);
      const listClose = new state.Token("bullet_list_close", "ul", -1);

      state.tokens.push(sectionOpen, sectionTitle, sectionClose, listOpen);

      backlinkList.forEach((backlink) => {
        const listItemOpen = new state.Token("list_item_open", "li", 1);
        const listItemClose = new state.Token("list_item_close", "li", -1);
        const listItemContent = new state.Token("inline", "", 0);
        listItemContent.content = backlink;
        listItemContent.children = [];

        state.tokens.push(listItemOpen, listItemContent, listItemClose);
      });

      state.tokens.push(listClose);
    }
  }

  // Define wikilink token type
  function tokenize(state, silent) {
    const start = state.pos;
    const marker = state.src.charCodeAt(start);

    if (silent) {
      return false;
    }

    if (marker !== 0x3d /* = */ && marker !== 0x5b /* [ */) {
      return false;
    }

    // Handle == for mark
    if (marker === 0x3d) {
      const scanned = state.scanDelims(state.pos, true);
      let len = scanned.length;
      const ch = String.fromCharCode(marker);

      if (len < 2) {
        return false;
      }

      if (len % 2) {
        const token = state.push("text", "", 0);
        token.content = ch;
        len--;
      }

      for (let i = 0; i < len; i += 2) {
        const token = state.push("text", "", 0);
        token.content = ch + ch;

        if (!scanned.can_open && !scanned.can_close) {
          continue;
        }

        state.delimiters.push({
          marker,
          length: 0, // disable "rule of 3" length checks meant for emphasis
          jump: i / 2, // 1 delimiter = 2 characters
          token: state.tokens.length - 1,
          end: -1,
          open: scanned.can_open,
          close: scanned.can_close,
        });
      }

      state.pos += scanned.length;
      return true;
    }

    // Handle [[ for wikilink
    if (marker === 0x5b && state.src.charCodeAt(start + 1) === 0x5b) {
      const end = state.src.indexOf("]]", start);

      if (end === -1) {
        return false;
      }

      const content = state.src.slice(start + 2, end);
      const [href, text] = content.split("|");
      const token = state.push("wikilink", "", 0);
      token.content = content;
      token.href = titleToUrl(href, "notes");
      token.text = text || href;

      state.pos = end + 2;
      return true;
    }

    return false;
  }

  function renderWikiLink(tokens, idx, options, env, self) {
    console.log(tokens[idx]);
    const token = tokens[idx];
    const href = md.utils.escapeHtml(token.href);
    const text = md.utils.escapeHtml(token.text);
    return `<a href="${href}" class="obsidian-link">${text}</a>`;
  }

  md.inline.ruler.after("link", "wikilink", tokenize);
  md.renderer.rules.wikilink = renderWikiLink;
  md.core.ruler.push("collect_backlinks", collectBacklinks);
  md.core.ruler.push("render_backlinks", renderBacklinks);
}

export default markdownItBacklinks;
