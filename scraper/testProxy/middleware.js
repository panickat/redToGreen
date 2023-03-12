const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const secrets = require("./secrets.json");
const myUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36";
const remoteSearch = secrets.sites[0].remoteSearch;
const remoteDownload = secrets.sites[1].remoteDownload;

function hostName(remoteSite) {
  return remoteSite.replace(/^https?:\/\//i, "");
}

function setHeaders(res, path) {
  if (/\.(gif|jpg|jpeg|png|th.jpg)$/i.test(path)) {
    res.setHeader("Content-Type", "");
  }
}

function createProxy(target, path) {
  return createProxyMiddleware(path, {
    target,
    changeOrigin: true,
    onProxyReq(proxyReq) {
      proxyReq.setHeader(
        "Cookie",
        "PHPSESSID=3o6kak1g5qsktf9cbkbjq47ve0=3; Domain=fastimages.org; Path=/"
      );
    },
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      Host: hostName(target),
      Pragma: "no-cache",
      Referer: target,
      "Sec-GPC": 1,
      "Upgrade-Insecure-Requests": 1,
      "User-Agent": myUserAgent,
    },
    setHeaders,
  });
}

const pathSearch = "/search/";
const pathDownload = "/";

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Proxy middlewares
app.use(pathSearch + ":id", createProxy(remoteSearch, pathSearch));
app.use(pathDownload + ":id", createProxy(remoteDownload, pathDownload));

// test to download pdf
const pathTotalplay = "/archivos/pdf/";
const remoteTotalplay = "https://totalplay.com.mx";
app.use(pathTotalplay + ":id", createProxy(remoteTotalplay, pathTotalplay));
// app.use(pathTotalplay + ":id", (req, res, next) => {
//   console.log("New URL visited:", req.originalUrl);
//   createProxy(remoteTotalplay, pathTotalplay)(req, res, next);
// });

// module.exports = app;

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
