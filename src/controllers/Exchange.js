const core = require('gls-core-service');
const Basic = core.controllers.Basic;

class Exchange extends Basic {
    async request({
        what: { assetTypeId, assetUniqueId, amount },
        forWhat: {
            assetTypeId: targetAssetTypeId,
            assetUniqueId: targetAssetUniqueId,
            amount: targetAmount,
        },
    }) {
        // TODO Check asset freeze
        // TODO Check account freeze
        // TODO -
        // TODO Log to feed.
    }

    async take({ exchangeId }) {
        // TODO Check asset freeze
        // TODO Check account freeze
        // TODO -
        // TODO Log to feed.
    }

    async approve({ exchangeId }) {
        // TODO Check asset freeze
        // TODO Check account freeze
        // TODO -
        // TODO Log to feed.
    }

    async cancel({ exchangeId }) {
        // TODO -
        // TODO Log to feed.
    }

    async getRequests({ assetTypeId, limit, sequenceKey }) {
        // TODO -
    }
}

module.exports = Exchange;
