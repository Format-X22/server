const core = require('gls-core-service');
const stats = core.utils.statsClient;
const BasicMain = core.services.BasicMain;
const env = require('./data/env');
const Connector = require('./services/Connector');
const Identity = require('./services/Identity');

class Main extends BasicMain {
    constructor() {
        super(stats, env);

        const identity = new Identity();
        const connector = new Connector({ identityService: identity });

        this.startMongoBeforeBoot();
        this.addNested(identity, connector);
    }
}

module.exports = Main;
