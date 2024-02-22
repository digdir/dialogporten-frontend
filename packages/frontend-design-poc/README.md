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

### Testing

#### Unit testing and integration testing

Unit testing and integration testing are run with [Vitest](https://vitest.dev/).
Tests (although few at the moment) are written with [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/). Remember to use custom render for all necessary providers.

Examples of tests:
- React component (test spec in the same folder as the component)
- Unit testing functions
- Integration tests: testing different React components (as stories) together

To run:

``test:watch``

Refer to `./vitest.config.ts`

#### End-to-end testing

The project is configured to use [Playwright](https://playwright.dev/) for end-to-end testing of user flows with mock data, and it is part of the CI/CD process.
The setup will start the development server as a dependency if it is not already running. Tests are located in `./tests/**`

Refer to `./playwright.config.ts`


### ENV

Uses [dotenv](https://www.npmjs.com/package/dotenv) for reading env files.

Env properties:

| Property name | Defaults to | Comment                                  |
|---------------|-------------|------------------------------------------|
|   PLAYWRIGHT_TEST_BASE_URL            |       http://localhost:5173/      | Used by Playright as expected server URL |
|               |             |                                          |
|               |             |                                          |

