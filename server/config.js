module.exports = (C) => {
	return({
		TTL: 60 * 60 * 24, // 1 day
    CHECK: 60 * 5, // 5 min
		MAX: 1073741824, // GIGABYTE

		env: 'dev',
		token: 'REPLACE_OR_GET_FROM_SECRET',

		// Application specific settings.
    application: {
      name: 'Node Cache',
      shortName: 'Node Cache'
		},

    log: {
      level: 'verbose'
    },

    jobs: {
      cache: {
        schedule: '0 0 * * *',
        runTime: 5*1000
      }
    }
	})
}
