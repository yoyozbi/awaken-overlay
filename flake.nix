{
  # Override nixpkgs to use the latest set of node packages
	inputs = {
		nixpkgs.url = "github:NixOS/nixpkgs/master";
		systems.url = "github:nix-systems/default";
		flake-utils.url = "github:numtide/flake-utils";
	};

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    systems,
  }:
    flake-utils.lib.eachSystem (import systems)
    (system: let
      pkgs = import nixpkgs {
        inherit system;
      };
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_18
          
          bun

					nodePackages.prisma
					postgresql_15
					openssl

          nodePackages.typescript
          nodePackages.typescript-language-server
					turbo
        ];
          shellHook = ''
        			  export PRISMA_QUERY_ENGINE_LIBRARY=${pkgs.prisma-engines}/lib/libquery_engine.node
                export PRISMA_QUERY_ENGINE_BINARY=${pkgs.prisma-engines}/bin/query-engine
                export PRISMA_SCHEMA_ENGINE_BINARY=${pkgs.prisma-engines}/bin/schema-engine
								export TURBO_BINARY_PATH="${pkgs.turbo}/bin/turbo"
          '';
			};
    });
}
