export function ObsidianLink(md, options = {}) {
  const wikiLinkRegex = /\[\[([^\|\]]+)(?:\|([^\]]+))?\]\]/g;
  const baseUrl = options.baseUrl || "";

  md.inline.ruler.before("link", "obsidian_link", function (state, silent) {
    const originalPos = state.pos;
    const src = state.src;
    let match;
    let matches = [];

    // Find all matches first
    while ((match = wikiLinkRegex.exec(src)) !== null) {
      matches.push({
        match: match,
        index: match.index,
        length: match[0].length,
      });
    }

    if (matches.length === 0) {
      return false;
    }

    let lastPos = originalPos;

    matches.forEach((item) => {
      if (!silent) {
        // Process any text before the match as a text token
        if (item.index > lastPos) {
          const textToken = state.push("text", "", 0);
          textToken.content = src.slice(lastPos, item.index);
        }

        // Create tokens for the link
        const token = state.push("link_open", "a", 1);
        token.attrs = [["href", baseUrl + item.match[1]]];

        const textToken = state.push("text", "", 0);
        textToken.content = item.match[2] || item.match[1];

        state.push("link_close", "a", -1);

        lastPos = item.index + item.length;
      }
    });

    if (!silent && lastPos < src.length) {
      // Process any remaining text after the last match
      const textToken = state.push("text", "", 0);
      textToken.content = src.slice(lastPos);
    }

    state.pos = src.length;
    return true;
  });

  md.renderer.rules.obsidian_link_open = function (tokens, idx) {
    const href = tokens[idx].attrs[0][1];
    return `<a class="obsidian-link" href="${href}">`;
  };

  md.renderer.rules.obsidian_link_close = function (tokens, idx) {
    return "</a>";
  };
}
