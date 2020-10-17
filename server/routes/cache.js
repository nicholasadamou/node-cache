module.exports = function(C, apiRoutes, auth) {

  const NodeCache = require("node-cache");
  let myCache = new NodeCache({ stdTTL: C.TTL, checkperiod: C.CHECK });

  const L = C.LOG;

  const set = (req, res) => {
    const A = '/cache/set:';

    const key = req.query.key || req.body.key || '';
    const value = req.query.value || req.body.value || '';
    L.verbose(`${A} Entered. Key '${key}'`);
    L.debug(`${A}`, value);

    let result = false;

    if (key && value) {
      myCache.set(key, value);
      result = true;
    }

    res.json(result);
  }

  const get = (req, res) => {
    const A = '/cache/get:';

    const key = req.query.key || req.body.key || '';
    L.verbose(`${A} Entered. Key '${key}'`);

    let result = undefined;

    // Note: Should not hit limit, but just in case, start the caching over.
    const stats = myCache.getStats();
    if (stats.ksize + stats.vsize > C.MAX) {

      const c = myCache;
      myCache = new NodeCache({ stdTTL: C.TTL, checkperiod: C.CHECK });
      c.flushAll();
      L.warn(`${A} Max cache size reached, so flushing cache.`);
    }
    else {

      const value = myCache.get(key);
      L.verbose(`${A} Key found in cache, returning value.`);
      L.debug(`${A}`, value);
      result = value;
    }

    if (result) {
      res.send(result);
    }
    else {
      res.sendStatus(404);
    }
  }

  apiRoutes.get('/cache/set', auth, set);
  apiRoutes.post('/cache/set', auth, set);

  apiRoutes.get('/cache/get', auth, get);
  apiRoutes.post('/cache/get', auth, get);

  apiRoutes.get('/cache/keys', auth, (req, res) => {
    const A = '/cache/keys:';
    L.verbose(`${A} Entered.`);

    res.json(myCache.keys());
  });

  apiRoutes.get('/cache/stats', auth, (req, res) => {
    const A = '/cache/stats:';
    L.verbose(`${A} Entered.`);

    res.json(myCache.getStats());
  });

  apiRoutes.get('/cache/flush', auth, (req, res) => {
    const A = '/cache/flush:';
    L.verbose(`${A} Entered.`);

    const c = myCache;
    myCache = new NodeCache({ stdTTL: C.TTL, checkperiod: C.CHECK });
    c.flushAll();

    res.json(true);
  });

  return { loaded: true };
}
