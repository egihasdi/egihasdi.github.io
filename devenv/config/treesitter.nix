{ pkgs, ... }:
{
  plugins.treesitter = {
    enable = true;
    settings.highlight = {
      enable = true;
      additional_vim_regex_highlighting = true;
    };
  };
}
