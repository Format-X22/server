const core = require('gls-core-service');
const BasicConnector = core.services.Connector;
const env = require('../data/env');

class Connector extends BasicConnector {
    constructor() {
        super();

        // TODO -
    }

    async start() {
        await super.start({
            serverRoutes: {
                // TODO -
            },
        });
    }
}

module.exports = Connector;