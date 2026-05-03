# Reach Variant Tool for Zed

This repository contains a Zed extension for Halo: Reach Variant Tool (`.rvt`) scripts.

Current scope:

- Tree-sitter based syntax highlighting
- Basic indentation and outline queries
- Snippets for common RVT blocks
- A lightweight language server that provides VS Code style keyword and member completions

## Install locally

1. Open Zed.
2. Run `zed: install dev extension`.
3. Select this repository directory.

## Validate locally

```bash
cargo check
npm install
./node_modules/.bin/tree-sitter generate
./node_modules/.bin/tree-sitter test
node --check src/server.js
```

## Publish notes

- `extension.toml` is pinned to the first publishable grammar commit. When the grammar changes, update `[grammars.rvt].commit` to the new commit SHA before releasing.
- To publish on Zed, push this repository to GitHub and then open a PR against `zed-industries/extensions` adding it as a submodule and registering the version in that repository's `extensions.toml`.
