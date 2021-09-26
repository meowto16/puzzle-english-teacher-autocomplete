const webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env"),
    CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin");
    CircularDependencyPlugin = require('circular-dependency-plugin')


// load the secrets
const alias = {};

const secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

const fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

const options = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    content: path.join(__dirname, "src", "js", "teacher", "content_scripts", "index.ts"),
    background: path.join(__dirname, "src", "js", "teacher", "background_scripts", "index.ts"),
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
        exclude: /node_modules/
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: alias,
    extensions: ['.ts', '.js'],
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new CopyWebpackPlugin([
      {
        from: "src/manifest.json",
        transform: function (content, path) {
          // generates the manifest file using the package.json informations
          return Buffer.from(JSON.stringify({
            description: process.env.npm_package_description,
            version: process.env.npm_package_version,
            ...JSON.parse(content.toString())
          }))
        },
        to: "[name].[ext]"
      },
      { from: "src/img/*", to: "img/[name].[ext]" },
      { from: "src/index.css", to: "[name].[ext]" },
    ]),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, "src", "popup.html"),
    //   filename: "popup.html",
    //   chunks: ["popup"]
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, "src", "options.html"),
    //   filename: "options.html",
    //   chunks: ["options"]
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, "src", "background.html"),
    //   filename: "background.html",
    //   chunks: ["background"]
    // }),
    new WriteFilePlugin(),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      include: /src/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    })
  ]
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-eval-source-map";
}

module.exports = options;
