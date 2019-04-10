const core = require('gls-core-service');
const Basic = core.controllers.Basic;

class History extends Basic {
    async get({ sequenceKey, limit }) {
        // TODO -
    }

    async getFor({ accountId, assetTypeId, sequenceKey, limit }) {
        // TODO -
    }

    async getForAll({ assetTypeId, sequenceKey, limit }) {
        // TODO -
    }

    async getBy({ transactionId }) {
        // TODO -
    }

    async addHook({ url, assetTypeId }) {
        // TODO -
    }

    async removeHook({ hookId }) {
        // TODO -
    }
}

module.exports = History;
