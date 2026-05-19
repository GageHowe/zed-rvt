# Reach Variant Tool for Zed

This repository contains a Zed extension for Halo: Reach Variant Tool (`.rvt`) scripts.

Current scope:

- Tree-sitter based syntax highlighting
- Basic indentation and outline queries
- Snippets for common RVT blocks

## Install locally

1. Open Zed.
2. Run `zed: install dev extension`.
3. Select this repository directory.

## Validate locally

```bash
npm install
./node_modules/.bin/tree-sitter generate
./node_modules/.bin/tree-sitter test
```

## Publish notes

- `extension.toml` should reference the public GitHub repository for `[grammars.rvt].repository` and the published grammar commit SHA for `[grammars.rvt].commit`.
- To publish on Zed, push this repository to GitHub and then open a PR against `zed-industries/extensions` adding it as a submodule and registering the version in that repository's `extensions.toml`.
