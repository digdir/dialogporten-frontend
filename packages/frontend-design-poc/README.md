# Arbeidsflate-frontend

Being built and running with HMR with vite.
Typesript and CSS modules.


## Getting starting

### Running locally

````
1. yarn
2. yarn dev
````

### Mock

Uses [msw](https://mswjs.io/) as API mocking library.

### i18n 

This project uses [react-i18next](https://react.i18next.com/) as internationalization framework, and is configured
with [ICU format](https://react.i18next.com/misc/using-with-icu-format), a widely used standard for message format.
[This page](https://unicode-org.github.io/icu/userguide/format_parse/messages/) describes the format and covers the most common use cases, including more complex examples.

`react-i18next`is configured in `./src/i18n/index.ts` and initiated as an import in `main.tsx`.
