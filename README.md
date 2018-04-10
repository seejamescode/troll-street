# [Troll Street](https://trollstreet.now.sh)

![Troll Street](/public/thumbnail.png?raw=true)

Find out how the internet trolls feel about your stock investments. Hosted online at https://trollstreet.now.sh.

## Development

1.  Install [Node](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/docs/install)
2.  [Register a new Twitter app](apps.twitter.com)
3.  Create `now.json` in the root of the project with your Twitter app values:

```
{
  "alias": ["whateverAppNameYouWant"],
  "files": ["build", "now.json"],
  "env": {
    "twitter_consumer_key": "yourTwitterAppConsumerKey",
    "twitter_consumer_secret":
      "yourTwitterAppConsumerSecret"
  }
}
```

4.  `yarn`
5.  `yarn start`
