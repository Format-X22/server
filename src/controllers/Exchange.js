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

    async getAssetTypes({}) {
        // TODO -
    }

    async getRequests({ assetTypeId, limit, sequenceKey }) {
        // TODO -
    }

    async openExchangeMarket({
        what: { assetTypeId, assetUniqueId, maxTotalAmount },
        forWhat: {
            assetTypeId: targetAssetTypeId,
            assetUniqueId: targetAssetUniqueId,
            maxTotalAmount: targetMaxTotalAmount,
        },
    }) {
        // TODO Check assetType
        // TODO -
        // TODO Log to feed.
    }

    async editExchangeMarket({
        exchangeMarketId,
        what: { maxTotalAmount },
        forWhat: { maxTotalAmount: targetMaxTotalAmount },
    }) {
        // TODO -
        // TODO Log to feed.
    }

    async closeExchangeMarket({ exchangeMarketId }) {
        // TODO -
        // TODO Log to feed.
    }
}

module.exports = Exchange;
