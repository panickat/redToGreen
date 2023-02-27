const express = require("express");
const router = express.Router();
const app = express();

const { createProxyMiddleware } = require("http-proxy-middleware");

function proxy(id) {
  return createProxyMiddleware("/search/" + id, {
    target: "http://camvideos.me",
    changeOrigin: true,
  });
}
router.use("/search/:id", (req, res, next) => {
  app.use("/search/" + req.params.id, proxy(req.params.id));
  next();
});

app.use("/", router);

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
