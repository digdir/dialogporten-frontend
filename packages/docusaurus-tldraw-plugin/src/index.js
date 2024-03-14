const tdlrPlugin = async (context, opts) => {
  return {
    // Plugin name
    name: 'docusaurus-tldraw-plugin',

    // Webpack config
    configureWebpack(config, isServer, utils) {
      return {
        module: {
          rules: [{ test: /\.tldr$/, type: 'asset/source' }],
        },
      };
    },

    // Inject Google Fonts into the header
    injectHtmlTags({ content }) {
      return {
        headTags: [
          { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
          { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
          {
            tagName: 'link',
            attributes: {
              rel: 'stylesheet',
              href: 'https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap',
            },
          },
        ],
      };
    },
  };
};

export default tdlrPlugin;
