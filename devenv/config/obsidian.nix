{ root, ... }:
{
  plugins.obsidian = {
    enable = true;
    settings = {
      workspaces = [
        {
          name = "egihasdi.gitlab.io";
          path = "${root}/src/notes";
        }
      ];
    };
  };
}
