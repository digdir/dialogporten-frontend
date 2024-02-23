# Dialogporten frontend

## Developer setup

Tool | Description
-----|------------
[fnm](https://github.com/Schniz/fnm) | Fnm is used to automatically get the correct version of Node in the project
Docker | We recommend to use OrbStack if you're using Mac for development, on Linux you can install Docker directly.
pnpm | Package manager used in this project
fzf | Fuzzy finder used in some scripts

### macOS

On macOS using [Homebrew](https://brew.sh/) you can install dependencies by running:

```bash
brew install fnm pnpm fzf
brew install --cask OrbStack
```

### Windows

On Windows using [Chocolatey](https://chocolatey.org/) you can install dependencies by running:

```bash
choco install -y fnm pnpm fzf docker-desktop
```

## Docker

Running Docker in watch mode:

```bash
make compose-watch
```
