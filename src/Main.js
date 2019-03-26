const core = require('gls-core-service');
const stats = core.utils.statsClient;
const BasicMain = core.services.BasicMain;
const env = require('./data/env');

class Main extends BasicMain {
    constructor() {
        super(stats, env);

        this.startMongoBeforeBoot();
        this.addNested(); // TODO
    }
}

module.exports = Main;
