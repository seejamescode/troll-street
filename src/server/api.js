import Fuse from "fuse.js";
import parallel from "async/parallel";
import request from "request";
import Twitter from "twitter";
import "now-env";

const apiStocks = "https://api.iextrading.com/1.0";
let fuse;
let active = [];
let symbols = [];

// Generate basic auth token for Twitter API
// Requires env variables for
// - twitter_consumer_key
// - twitter_consumer_secret
// Generate them at https://apps.twitter.com/
let twitterClient;
const twitterCredentialsBase64Encoded = new Buffer(
  `${process.env.twitter_consumer_key}:${process.env.twitter_consumer_secret}`
).toString("base64");
request(
  {
    url: "https://api.twitter.com/oauth2/token",
    method: "POST",
    headers: {
      Authorization: `Basic ${twitterCredentialsBase64Encoded}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: "grant_type=client_credentials"
  },
  (err, resp, body) => {
    twitterClient = new Twitter({
      bearer_token: JSON.parse(body).access_token,
      twitter_consumer_key: process.env.twitter_consumer_key,
      twitter_consumer_secret: process.env.twitter_consumer_secret
    });
  }
);

// Update fuse.js search function
// with all available symbols
const updateSymbols = () => {
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

// Update most list of most active symbols
// for empty search query
const updateActive = () => {
  request(
    {
      url: `${apiStocks}/stock/market/list/mostactive`
    },
    (error, response, body) => {
      const results = JSON.parse(body);
      active =
        !error && response.statusCode == 200 && results.length > 0
          ? results
              .map(symbol => symbol.symbol)
              .slice(0, 50)
              .join(",")
          : active;
    }
  );
};

// Update both default search and
// fuse.js search function every hour
updateActive();
updateSymbols();
setInterval(() => {
  updateActive();
  updateSymbols();
}, 600000);

module.exports = app => {
  // Symbols: most active
  app.get("/symbols/", function(req, res) {
    request(
      {
        url: `${apiStocks}/stock/market/batch?symbols=${active}&types=quote,chart&range=dynamic`
      },
      (error, response, body) => {
        if (!error && response.statusCode == 200) {
          res.send(JSON.parse(body));
        }
      }
    );
  });

  // Symbols: search query
  app.get("/symbols/:query", function(req, res) {
    const filtered = fuse
      .search(req.params.query)
      .map(symbol => symbol.symbol)
      .slice(0, 50)
      .join(",");

    request(
      {
        url: `${apiStocks}/stock/market/batch?symbols=${filtered}&types=quote`
      },
      (error, response, body) => {
        if (!error && response.statusCode == 200) {
          res.send(JSON.parse(body));
        }
      }
    );
  });

  // Specific symbol data
  app.get("/symbol/:symbol", function(req, res) {
    parallel(
      {
        iex: function(callback) {
          request(
            {
              url: `${apiStocks}/stock/${
                req.params.symbol
              }/batch?types=quote,news,chart&range=dynamic&last=10`
            },
            (error, response, body) => {
              if (!error && response.statusCode == 200) {
                callback(null, JSON.parse(body));
              }
            }
          );
        },
        twitter: function(callback) {
          twitterClient.get(
            "search/tweets",
            { q: `$${req.params.symbol} -filter:retweets` },
            function(error, tweets, response) {
              if (!error && response.statusCode == 200) {
                callback(null, tweets);
              }
            }
          );
        }
      },
      function(err, results) {
        if (!err) {
          res.send(results);
        }
      }
    );
  });
};
