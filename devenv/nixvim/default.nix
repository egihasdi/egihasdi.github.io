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
    ./image.nix
  ];
  
  clipboard = {
    register = "unnamedplus";
  };

  /*
    config = {
      globals.mapleader = " ";

      viAlias = true;
      vimAlias = true;
    }
  */
  viAlias = true;
  vimAlias = true;
  globals.mapleader = " ";

  opts = {
    conceallevel = 2;
    splitkeep = "screen";
    showtabline = 0;
    preserveindent = true;
    cursorline = true;
    shiftwidth = 2;
    relativenumber = true;
    number = true;
    fillchars = {
      eob = " ";
    };
    # background = "dark";
    laststatus = 3;
  };

  colorschemes.gruvbox = {
    enable = true;
  };

  keymaps =
    let
      forceWrite = {
        action = "<cmd>silent! update! | redraw<cr>";
        options.desc = "Force write";
      };
    in
    [
      {
        inherit (forceWrite) action options;
        mode = "n";
        key = "<c-s>";
      }
      {
        inherit (forceWrite) options;
        mode = [
          "i"
          "x"
        ];
        key = "<c-s>";
        action = "<esc>" + forceWrite.action;
      }
      {
        mode = "n";
        action = "<cmd>BufferLineCyclePrev<CR>";
        key = "<S-h>";
      }
      {
        mode = "n";
        action = "<cmd>BufferLineCycleNext<CR>";
        key = "<S-l>";
      }
      {
        mode = "n";
        action = "<cmd>bp<bar>sp<bar>bn<bar>bd<cr>";
        key = "<leader>c";
      }
      {
        mode = "n";
        action = "<cmd>BufferLineCloseOther<cr>";
        key = "<leader>C";
      }
    ];
}
