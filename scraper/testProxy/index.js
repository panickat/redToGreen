const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();
const app = express();
const secrets = require("./secrets.json");

const myUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36";

const remoteSite = secrets.remoteSite;
const hostName = remoteSite.replace("http://", "");
// function getTime(tittle) {
//   // Get the current time
//   const currentTime = new Date();

//   // Get the hours, minutes, and seconds from the current time
//   const hours = currentTime.getHours();
//   const minutes = currentTime.getMinutes();
//   const seconds = currentTime.getSeconds();

//   // Log the current time to the console
//   console.log(`${tittle} ${hours}:${minutes}:${seconds}.`);
// }
function proxy(id) {
  return createProxyMiddleware("/search/" + id, {
    target: remoteSite,
    changeOrigin: true,
    onProxyReq: function (proxyReq) {
      // Add a cookie to the request
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
      Host: hostName,
      Pragma: "no-cache",
      Referer: remoteSite,
      "Sec-GPC": 1,
      "Upgrade-Insecure-Requests": 1,
      "User-Agent": myUserAgent,
    },
  });
}

router.use("/search/:id", (req, res, next) => {
  app.use("/search/" + req.params.id, proxy(req.params.id));
  next();
});

app.use("/", router, (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
