# Husky

This project uses [Husky](https://typicode.github.io/husky/) with `pre-commit hook` to format, sort imports, lint, and apply safe fixes
before the files are committed by running `lint-staged` which again triggers `biome`'s attention.

The pattern it uses to inspect _staged_ files are defined in the roots `package.json`.

In order to override the hook (not recommended) the `-no-verify` can be used, e.g. `git commit --no-verify.`