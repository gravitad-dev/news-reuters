const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(express.static("public"));

const apiProxy1 = createProxyMiddleware("/", {
  target: "https://www.reuters.com",
  changeOrigin: true,
});

const apiProxy2 = createProxyMiddleware("/business", {
  target: "https://www.reuters.com",
  changeOrigin: true,
});

app.use(apiProxy1);
app.use(apiProxy2);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
