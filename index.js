/*
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
    const response = await axios.get("http://news-proxy-two.vercel.app/");
    const $ = cheerio.load(response.data);
    //$(".ad").remove(); // Eliminar todos los elementos con la clase 'clase-a-eliminar' del DOM
    $(".ad-slot__container__FEnoz").remove();
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
*/

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Crear una instancia de proxy utilizando http-proxy-middleware
const apiProxy = createProxyMiddleware("/", {
  target: "https://www.reuters.com",
  changeOrigin: true,
});

// Agregar el middleware de proxy a la aplicación Express
app.use("/", apiProxy);

// Manejar solicitudes de raíz para indicar que el servidor está funcionando
app.get("/", (req, res) => {
  res.send("El servidor proxy inverso está en línea!");
});

// Ruta original sin el proxy inverso
app.get("/business", async (req, res) => {
  try {
    const response = await axios.get("https://www.reuters.com");
    const $ = cheerio.load(response.data);
    //$(".ad").remove(); // Eliminar todos los elementos con la clase 'clase-a-eliminar' del DOM
    $(".ad-slot__container__FEnoz").remove();

    // Agregar encabezados a la respuesta
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    res.send($.html());
  } catch (error) {
    res.send(`Error: ${error.message}`);
  }
});

// Iniciar el servidor Express en el puerto 4000
app.listen(4000, () => {
  console.log(
    "El servidor proxy inverso está en línea en http://localhost:4000"
  );
});
