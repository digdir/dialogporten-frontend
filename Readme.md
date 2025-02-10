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
corepack enable
corepack prepare --activate
```

### Windows

On Windows using [Chocolatey](https://chocolatey.org/) you can install dependencies by running:

```bash
choco install -y fnm pnpm fzf docker-desktop
```

## Running Docker locally

First you'll need to setup an `.env` file:

### env
Ensure that `./.env` (in root) is created with following keys and appropriate values (**Note**: replace the examples)
```
CLIENT_ID=<my_example_service>
CLIENT_SECRET=<secret_password_keep_this_private>
```

## Docker

Running Docker in watch mode:

```bash
make pull (optional)
make dev
```
