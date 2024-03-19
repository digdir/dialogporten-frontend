# Docusaurus Tldraw plugin

## Usage

1. Add the dependency to your Docusaurus project:

```json
"dependencies": {
    "docusaurus-tldraw-plugin": "workspace: *",
}
```

2. Add the usage of the plugin to your `docusaurus.config.ts` file:

```javascript
const config: Config = {
    // ...

	plugins: [
		'docusaurus-tldraw-plugin',	
	],

    // ...
};
```

3. Create a diagram on [tldraw.com](https://tldraw.com) or using the [TLDraw VSCode plugin](https://marketplace.visualstudio.com/items?itemName=tldraw-org.tldraw-vscode)

4. Use the diagram as a part of your documentation in an `.mdx` file:

```mdx
import { Tldr } from 'docusaurus-tldraw-plugin/src/tldr.jsx';
import document from './document.tldr';

# Intro

## Tldr

<Tldr children={document} />
```
