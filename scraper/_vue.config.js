module.exports = {
  devServer: {
    before: require("./testProxy"),
  },
};
