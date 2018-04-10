import compression from "compression";
import express from "express";
import api from "./api";

const app = express();
const port = process.env.PORT || 8080;

app.use(compression());
app.enable("trust proxy");

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

api(app);

app.use(express.static("./build"));

app.listen(port, err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`App and API is live at http://localhost:${port}`);
});
