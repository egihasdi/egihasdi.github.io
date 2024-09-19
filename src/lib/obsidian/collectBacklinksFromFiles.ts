import { walk } from "https://deno.land/std/fs/mod.ts";
import markdownIt from "https://esm.sh/markdown-it@12.2.0";
import mdItCollectBacklinks from "./collect-backlink.ts";

export async function collectBacklinksFromFiles(folderPath) {
  const backlinks = {};
  const md = markdownIt().use(mdItCollectBacklinks, { backlinks });
  for await (const entry of walk(folderPath, { exts: [".md"] })) {
    if (entry.isFile) {
      const fileContent = await Deno.readTextFile(entry.path);

      const env = { filename: entry.name };
      md.render(fileContent, env);
    }
  }
  return backlinks;
}
