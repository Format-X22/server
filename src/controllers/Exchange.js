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
        throw { code: 501, message: 'Not implemented' };

        // TODO Check asset freeze
        // TODO Check account freeze
        // TODO -
        // TODO Log to feed.
    }

    async take({ exchangeId }) {
        throw { code: 501, message: 'Not implemented' };

        // TODO Check asset freeze
        // TODO Check account freeze
        // TODO -
        // TODO Log to feed.
    }

    async approve({ exchangeId }) {
        throw { code: 501, message: 'Not implemented' };

        // TODO Check asset freeze
        // TODO Check account freeze
        // TODO -
        // TODO Log to feed.
    }

    async cancel({ exchangeId }) {
        throw { code: 501, message: 'Not implemented' };

        // TODO -
        // TODO Log to feed.
    }

    async getRequests({ assetTypeId, limit, sequenceKey }) {
        throw { code: 501, message: 'Not implemented' };

        // TODO -
    }
}

module.exports = Exchange;
