const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// url webs directions
const URLS = {
  ELPAIS: "http://elpais.com/america-colombia/?ed=col",
  REUTERS: "http://www.reuters.com/business",
  CNN: "http://cnnespanol.cnn.com/seccion/economia-y-negocios",
};

// proxy
const corsProxy = createProxyMiddleware({
  target: URLS.REUTERS,
  changeOrigin: true,
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers["access-control-allow-origin"] = "*";
    proxyRes.headers["access-control-allow-credentials"] = "true";
  },
});

// Ruta original sin el proxy inverso
app.get("/web", async (req, res) => {
  try {
    const response = await axios.get("https://news-proxy-two.vercel.app/");
    const $ = cheerio.load(response.data);
    //$(".ad").remove(); // Eliminar todos los elementos con la clase 'clase-a-eliminar' del DOM
    //$(".ad-giga").remove();
    res.send($.html());
  } catch (error) {
    res.send(`Error: ${error.message}`);
  }
});

//app
app.use("/", corsProxy);

app.listen(3000, () => {
  console.log("Server start on port 3000");
});
