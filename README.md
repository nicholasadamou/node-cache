# node-cache

A node-based cache built using [node-cache](https://www.npmjs.com/package/node-cache).

## 🏁 Getting Started

⚠️ Prior to installing and configuring the tooling on our system, let's first set-up our GitHub SSH keys for IBM.

- Please follow the guide found [here](https://docs.github.com/en/enterprise/2.21/user/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account) to configure your GitHub Enterprise account to use your new (or existing) SSH key.

### Configuration

Please edit [server/config.js](server/config.js) for local development.

### Set Up

**Clone** the [node-cache](https://github.ibm.com/nicholasadamou/node-cache) repository:

```bash
git clone git@github.com:nicholasadamou/node-cache.git
```

**Create .env** that contains some of the following _secrets_.

```text
ENV=<Which "env" to load configuration for [dev, test, prod]>
TOKEN=<The token used to authenticate a session>
```

### Using `nodemon`

The below script will install node dependencies and start the server using [nodemon](https://www.npmjs.com/package/nodemon).

```bash
npm run install-dependencies && \
 npm run mon
```

### API

Each API endpoint requires the client to be authenticated prior to executing the endpoint task. This is based on the `process.env.TOKEN` secret.

#### `/cache/set?key=<KEY>&value=<VALUE>` [GET|POST]

This endpoint takes two query parameters: `key` and `value`.

These two parameters can also exist in the GET or POST request body.

If the two parameters exist and are not undefined, then the cache is set with that key-value pair and the result (true or false) is returned to the client.

#### `/cache/get?key=<KEY>` [GET|POST]

This endpoint takes a `key` query parameter.

This parameter can also exist in the GET or POST request body.

This endpoint checks if the maximum cache size was reached. If it is reached it the cache is flushed. If it is not reached then the cache will attempt to get the value held by that key. If not it will return a 404 Not Found error indicating that the value held at that key in the cache does not exist or cannot be found.

#### `/cache/keys` [GET]

This endpoint will return the set of all keys held within the cache.

#### `/cache/stats` [GET]

This endpoint will return stats of the cache (e.g. hits, misses, etc).

#### `/cache/flush` [GET]

This endpoint will flush the cache.
