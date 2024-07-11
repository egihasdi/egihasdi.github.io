import lume from "lume/mod.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import catppuccin from "npm:@catppuccin/tailwindcss";
import typography from "npm:@tailwindcss/typography";

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

site.use(postcss());

export default site;
