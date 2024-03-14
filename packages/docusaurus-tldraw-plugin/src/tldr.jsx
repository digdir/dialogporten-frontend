import BrowserOnly from '@docusaurus/BrowserOnly';
import { useMemo } from 'react';
import { Tldraw, createTLSchema, parseTldrawJsonFile } from 'tldraw';
import 'tldraw/tldraw.css';

export const Tldr = ({ children, height }) => {
  const { value: store, err } = useMemo(
    () => parseTldrawJsonFile({ json: children, schema: createTLSchema() }),
    [children],
  );

  if (err) {
    console.log(result.err);
    return <div>Error loading tldr file</div>;
  }

  if (!store) {
    return <div>Loading document...</div>;
  }

  return (
    <div style={{ height: height || '500px', position: 'relative', fontFamily: 'Inter' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <BrowserOnly fallback={<div>Loading...</div>}>
          {() => {
            return (
              <Tldraw
                inferDarkMode
                store={store}
                onMount={(editor) => {
                  editor.updateInstanceState({ isReadonly: true });
                }}
              />
            );
          }}
        </BrowserOnly>
      </div>
    </div>
  );
};
