# Arbeidsflate-frontend

Being built and running with HMR with vite.
Typesript and CSS modules.


## Getting starting

### Running locally

````
1. yarn
2. yarn dev
````


### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```


