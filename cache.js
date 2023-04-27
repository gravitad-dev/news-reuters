const express = require("express");
const proxy = require("http-proxy-middleware");
const cache = require("memory-cache");

const app = express();

// Configura el proxy middleware
const apiProxy = proxy({
  target: "https://cnnbusiness.net/", // Cambia la URL a la que quieres hacer reverse proxy
  changeOrigin: true,
  xfwd: true,

  onProxyRes: (proxyRes, req, res) => {
    // Almacena la respuesta en caché
    const key = req.originalUrl || req.url;
    const body = [];
    proxyRes.on("data", (chunk) => {
      body.push(chunk);
    });
    proxyRes.on("end", () => {
      const data = Buffer.concat(body);
      cache.put(key, data, 1000 * 60 * 60); // Almacena en caché durante una hora (en milisegundos)
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    // Verifica si la respuesta está en caché
    const key = req.originalUrl || req.url;
    const cachedData = cache.get(key);
    if (cachedData) {
      res.setHeader("Content-Type", "text/html");
      res.send(cachedData);
      res.end();
    }
  },
});

// Usa el proxy middleware para todas las solicitudes
app.use("/", apiProxy);

// Inicia el servidor
app.listen(8080, () => {
  console.log("Servidor iniciado en http://localhost:8080");
});
