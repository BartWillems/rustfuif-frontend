const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
  // other configuration
  configureWebpack: {
    plugins: [
      new SentryWebpackPlugin({
        // sentry-cli configuration
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "

bartwillems",
        project: "

rustfuif-frontend",

        // webpack specific configuration
        include: ".",
        ignore: ["node_modules", "webpack.config.js"],
      }),
    ],
  },
};