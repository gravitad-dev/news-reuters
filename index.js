const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());
app.options("*", cors());

app.use("/", express.static(__dirname + "/public/index.html"));
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/news", express.static(__dirname + "/public/news.html"));
app.get("/news", async (req, res) => {
  res.sendFile(__dirname + "/public/news.html");
});

const apiProxy1 = createProxyMiddleware("/", {
  target: "https://www.reuters.com",
  changeOrigin: true,
});

const apiProxy2 = createProxyMiddleware("/business", {
  target: "https://www.reuters.com",
  changeOrigin: true,
});

app.get("/noadd", async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3000/business`);
    const $ = cheerio.load(response.data);
    $(".ad-slot__container__FEnoz").remove(); // Eliminar todos los elementos con la clase 'clase-a-eliminar' del DOM
    res.send($.html());
  } catch (error) {
    res.send(`Error: ${error.message}`);
  }
});

app.use(apiProxy1);
app.use(apiProxy2);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
