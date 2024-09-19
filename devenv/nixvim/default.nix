{
  # Import all your configuration modules here
  imports = [
    ./bufferline.nix
    ./obsidian.nix
    ./treesitter.nix
    ./cmp.nix
    ./nvim-autopairs.nix
    ./fzf-lua.nix
    ./zen-mode.nix
  ];

  opts = {
    conceallevel = 1;
    relativenumber = true;
    number = true;
    fillchars = {
      eob = " ";
    };
    background = "dark";
    laststatus = 3;
  };

  colorschemes.gruvbox = {
    enable = true;
  };
}
