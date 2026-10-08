// webpack only bundles: no loaders, no Babel, no TypeScript.
//
// Sources are plain JavaScript today. From step 5 on they are TypeScript, and
// Bazel compiles them to .js with ts_project *before* webpack runs, so this file
// never changes. Paths are relative to the working directory: this package for
// `pnpm start`, and also under Bazel because the webpack targets set
// `chdir = package_name()`.
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
  devServer: {
    port: 8080,
  },
};
