module.exports = function(C, apiRoutes, ensureAuthenticated, CONFIG_KEY) {

  const UTILS = require('../utils');

  let routeConfig = {};
  routeConfig[CONFIG_KEY] = {};

  //////////////////////////////////////////////////////////////////////////////

  apiRoutes.use((req, res, next) => {
    next();
  });

  //////////////////////////////////////////////////////////////////////////////

  routeConfig[CONFIG_KEY].user = UTILS.appendConfig(routeConfig[CONFIG_KEY].user = {}, require('./cache')(C, apiRoutes, ensureAuthenticated));

  return {
    getConfig: () => routeConfig
  }
}
