import compression from "compression";
import express from "express";
import Fuse from "fuse.js";
import { parse } from "node-html-parser";
import path from "path";
import request from "request";

const app = express();
const port = process.env.PORT || 8080;
const apiStocks = "https://api.iextrading.com/1.0";
let fuse;
let active = [];
let symbols = [];

app.use(compression());
app.enable("trust proxy");

const updateSymbols = () => {
  // All symbols
  request(
    {
      url: `${apiStocks}/ref-data/symbols`
    },
    (error, response, body) => {
      const results = JSON.parse(body);
      const newSymbols =
        !error && response.statusCode == 200 && results.length > 0
          ? results
          : fuse.list;

      fuse = new Fuse(newSymbols, {
        threshold: 0.3,
        keys: ["name", "symbol"]
      });
      symbols = newSymbols;
    }
  );
};

const updateActive = () => {
  // Relevant symbols
  request(
    {
      url: `${apiStocks}/stock/market/list/mostactive`
    },
    (error, response, body) => {
      const results = JSON.parse(body);
      active =
        !error && response.statusCode == 200 && results.length > 0
          ? body
          : active;
    }
  );
};

updateActive();
updateSymbols();
setInterval(() => {
  updateActive();
  updateSymbols();
}, 600000);

// All production requests should be forwarded to https
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.secure || req.headers.host === `localhost:${port}`) {
      next();
    } else {
      res.redirect(`https://${req.headers.host}${req.url}`);
    }
  });
}

// Symbols all
app.get("/symbols/", function(req, res) {
  res.send(active);
});

// Symbols search
app.get("/symbols/:query", function(req, res) {
  res.send(fuse.search(req.params.query).slice(0, 50));
});

// Specific symbol data

app.use(express.static("./build"));

app.listen(port, err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`App and API is live at http://localhost:${port}`);
});
