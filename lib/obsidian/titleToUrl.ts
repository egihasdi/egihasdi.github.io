import { existsSync } from "jsr:@std/fs";
import createSlugifier, {
  defaults as slugifierDefaults,
} from "lume/core/slugifier.ts";
import { extract } from "jsr:@std/front-matter/yaml";

const slugify = createSlugifier(slugifierDefaults);

export const titleToUrl = (title, folder) => {
  const path = `${folder}/${title}.md`;

  if (existsSync(path)) {
    const markdown = Deno.readTextFileSync(path);
    const result = extract(markdown);

    const aliases = result.attrs.aliases[0];

    return `/${slugify(aliases)}`;
  }

  return `/${slugify(title, { lower: true })}`;
};
