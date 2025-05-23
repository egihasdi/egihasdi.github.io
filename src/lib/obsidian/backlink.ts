function markdownItBacklinks(md, options = {}) {
  const backlinks = options.backlinks || {};

  // Render backlinks at the end of the document
  function renderBacklinks(state) {
    const env = state.env;
    const fileId = env.data.id || "unknown";
    const backlinkList = backlinks[fileId];

    if (backlinkList && backlinkList.length > 0) {
      const divOpen = new state.Token('html_block', '', 0);
      divOpen.content = `
          <hr class="backlinks-sep" />
          <div class="backlinks">
      `;
      const divClose = new state.Token('html_block', '', 0);
      divClose.content = '</div>';

      const sectionOpen = new state.Token("paragraph_open", "p", 1);
      const sectionTitle = new state.Token("inline", "", 0);

      const text = new state.Token("text", "", 0);
      text.content = "LINKS TO THIS NOTE:";

      sectionTitle.content = "Backlinks:";
      sectionTitle.children = [];

      const sectionTitleClose = new state.Token("paragraph_close", "p", -1);

      const listOpen = new state.Token("bullet_list_open", "ul", 1);
      listOpen.attrs = [["class", "backlinks-list"]]
      const listClose = new state.Token("bullet_list_close", "ul", -1);

      state.tokens.push(
        divOpen,
        sectionOpen,
        sectionTitle,
        text,
        sectionTitleClose,
        listOpen,
      );

      backlinkList.forEach((backlink) => {
        const listItemOpen = new state.Token("list_item_open", "li", 1);
        const listItemContent = new state.Token("inline", "", 0);
        const listItemClose = new state.Token("list_item_close", "li", -1);

        const linkOpen = new state.Token("link_open", "a", 1);
        linkOpen.attrs = [["href", `/${backlink.slug}`], ['class', 'obsidian-link']];
        const text = new state.Token("text", "", 0);
        text.content = backlink.alias;
        const linkClose = new state.Token("link_close", "a", -1);

        listItemContent.children = [linkOpen, text, linkClose];
        state.tokens.push(listItemOpen, listItemContent, listItemClose);
      });

      state.tokens.push(listClose, divClose);
    }
  }

  md.core.ruler.push("render_backlinks", renderBacklinks);
}

export default markdownItBacklinks;
