# Embeddable markdown html

React components for rendering Markdown and Html at runtime.

Usage:

```jsx
import { Markdown, Html } from 'embeddable-markdown-html";

const Testcomponent = () => {
  return (
    <div>
      <Markdown># header</Markdown>
      <Html>{`<h1> header </h1>`}</Html>
    </div>
  );
}
```

## Inspired by

https://github.com/remarkjs/react-remark/tree/main
