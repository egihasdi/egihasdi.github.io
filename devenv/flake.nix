{
  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    systems.url = "github:nix-systems/default";

    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";

    devenv.url = "github:cachix/devenv";
    devenv.inputs.nixpkgs.follows = "nixpkgs";

    nixvim.url = "github:nix-community/nixvim";
    nixvim.inputs.nixpkgs.follows = "nixpkgs-unstable";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs =
    {
      self,
      nixpkgs,
      nixpkgs-unstable,
      devenv,
      systems,
      nixvim,
      ...
    }@inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      packages = forEachSystem (system: {
        devenv-up = self.devShells.${system}.default.config.procfileScript;
      });

      devShells = forEachSystem (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};

          pkgs-unstable = nixpkgs-unstable.legacyPackages.${system};
          nixvim' = nixvim.legacyPackages.${system};
        in
        {
          default = devenv.lib.mkShell {
            inherit inputs pkgs;
            modules = [
              (
                { config, ... }:
                let
                  nixvimModule = {
                    pkgs = pkgs-unstable;
                    module = import ./nixvim;
                    extraSpecialArgs =
                      {
                        root = config.devenv.root;
                      };
                  };
                  nvim = nixvim'.makeNixvimWithModule nixvimModule;
                in
                {
                  # https://devenv.sh/reference/options/
                  packages = [
                    nvim
                    pkgs.xclip
                    pkgs.ripgrep
                  ];
                  
                  languages.deno.enable = true;
                }
              )
            ];
          };
        }
      );
    };
}
