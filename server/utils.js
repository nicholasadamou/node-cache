const UTILS_IMPL = {

  mergeRecursive: (obj1, obj2) => {

    for (let p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor == Object) {
          obj1[p] = UTILS_IMPL.mergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch(e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  },

  getEnvConfig: (env, isLocal, shared, dev, prod) => {

    let envProps = {};
    switch (env) {
      case 'dev':
      case 'test':
      case 'preprod':
        envProps = dev;
        break;
      case 'prod':
        envProps = prod;
        break;
      default:
    }
    return UTILS_IMPL.mergeRecursive(shared, envProps);
  },

  appendConfig: (oldConfig, newConfig) => {

    return UTILS_IMPL.mergeRecursive(oldConfig, newConfig ? newConfig : {});
  }
};

module.exports = UTILS_IMPL;
