const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/piston",
    createProxyMiddleware({
      target: "http://localhost:2000",
      changeOrigin: true,
      pathRewrite: { "^/piston": "" },
    })
  );
};
