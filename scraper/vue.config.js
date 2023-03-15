module.exports = {
  publicPath: "/search",
  configureWebpack: {
    devServer: {
      headers: { "Access-Control-Allow-Origin": "*" },
      proxy: {
        "/apiVue": {
          target: "http://localhost:8080", // The URL of your backend server
          changeOrigin: true,
          pathRewrite: {
            "^/apiVue": "", // Remove the /api prefix from the URL
          },
          headers: {
            "Access-Control-Allow-Origin": "*", // Allow requests from any origin
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Allow the specified HTTP methods
            "Access-Control-Allow-Headers":
              "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method",
            Allow: "GET, POST, OPTIONS, PUT, DELETE",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        },
      },
    },
  },
};
