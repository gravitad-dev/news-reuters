const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

// Listen on a specific port via the PORT environment variable
var host = process.env.HOST || "0.0.0.0";
var port = process.env.PORT || 4000;

// app config
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

// Crear una instancia de proxy utilizando http-proxy-middleware
const apiProxy = createProxyMiddleware({
  target: "https://www.reuters.com",
  changeOrigin: true,
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers["access-control-allow-origin"] = "*";
    proxyRes.headers["access-control-allow-credentials"] = "true";
  },
});

app.get("/business", async (req, res) => {
  try {
    const response = await axios.get(`https://www.reuters.com`);
    const $ = cheerio.load(response.data);
    $(".site-header__inner__3w4vv").remove(); // Eliminar todos los elementos con la clase 'clase-a-eliminar' del DOM
    $(".ad-slot__container__FEnoz").remove();
    res.send($.html());
  } catch (error) {
    res.send(`Error: ${error.message}`);
  }
});

// ###########################  APP ################################
app.use("/", apiProxy);

// Manejar solicitudes de raíz para indicar que el servidor está funcionando
app.get("/business", (req, res) => {
  res.send("El servidor proxy inverso está en línea!");
});

// ruta independiente con html
app.use(express.static(__dirname + "/public"));
app.get("/web", async (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Iniciar el servidor Express en el puerto 4000
app.listen(port, () => {
  console.log(`El servidor proxy inverso está en línea en localhost:${port}`);
});

/*


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("X-CMC_PRO_API_KEY", "559a9a85-12cb-466c-a60f-6a088198fb45");
  res.setHeader(
    "Access-Control-Allow-Headers",
    `reuters-geo={"country":"-", "region":"-"}`
  );
  res.setHeader("Accept-Encoding", `gzip, deflate, br`);

  next();
});

var cors_proxy = require("cors-anywhere");
cors_proxy
  .createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie", "cookie2"],
  })
  .listen(port, host, function () {
    console.log("Running CORS Anywhere on " + host + ":" + port);
  });
*/
