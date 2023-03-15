const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
// const myUserAgent =
//   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36";

const app = express();
app.use(cors());

const secrets = require("./secrets.json");

// const remoteOpenprovider = secrets.remoteOpenprovider;
// const remoteCloudflare = secrets.remoteCloudflare;

// function hostName(remoteSite) {
//   return remoteSite.replace(/^https?:\/\//i, "");
// }

// function setHeaders(res, path) {
//   if (/\.(gif|jpg|jpeg|png|th.jpg)$/i.test(path)) {
//     res.setHeader("Content-Type", "");
//   }
// }

// function createProxy(target, path) {
//   console.log(`## createProxy for target ${target} and path ${path}`);
//   return createProxyMiddleware(path, {
//     target,
//     changeOrigin: true,
//     onProxyReq(proxyReq, req, res) {
//       proxyReq.setHeader(
//         "Cookie",
//         "PHPSESSID=3o6kak1g5qsktf9cbkbjq47ve0=3; Domain=fastimages.org; Path=/"
//       );
//       proxyReq.id = req.params.id;
//       console.log(
//         `## onProxyReq received for ${req.url} with id ${req.params.id}`
//       );
//       console.info("## res: ", res);
//     },
//     headers: {
//       Accept:
//         "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
//       "Accept-Encoding": "gzip, deflate",
//       "Accept-Language": "en-US,en;q=0.9",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//       Host: hostName(target),
//       Pragma: "no-cache",
//       Referer: target,
//       "Sec-GPC": 1,
//       "Upgrade-Insecure-Requests": 1,
//       "User-Agent": myUserAgent,
//     },
//     setHeaders,
//   });
// }

// CORS headers
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });
// Proxy middlewares

// proxy middleware options

function setOptions(target, oldPath, newPath) {
  /** @type {import('http-proxy-middleware/dist/types').Options} */
  return {
    target, // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
      [`^${oldPath}`]: newPath, // rewrite path
    },
  };
}

const searchOptions = setOptions(
  secrets.remoteSearch,
  "/api/search",
  "/search"
);
const searchProxy = createProxyMiddleware(searchOptions);
app.use("/api/search", searchProxy);

const downloadOptions = setOptions(secrets.remoteOpen, "/api/open", "/");
const downloadProxy = createProxyMiddleware(downloadOptions);
app.use("/api/open", downloadProxy);

const totalOptions = setOptions(
  secrets.remoteTotal,
  "/api/total",
  "/archivos/pdf"
);
const totalProxy = createProxyMiddleware(totalOptions);
app.use("/api/total", totalProxy);

app.use((req, res, next) => {
  console.log(`## req.url: ${req.url}`);
  console.info("req.originalUrl: ", req.originalUrl);
  console.info("req.baseUrl: ", req.baseUrl);
  next();
  console.info("## after next()");
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});

process.on("SIGINT", function () {
  console.log("CTRL+C pressed, executing cleanup code...");
  // execute your cleanup code here
  const exec = require("child_process").exec;
  exec(
    "kill $(ps aux | grep 'node testProxy/middleware.js' | awk '{print $2}' | tail -n 1)"
  );
  process.exit(0);
});
