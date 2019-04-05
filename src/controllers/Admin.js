const core = require('gls-core-service');
const Basic = core.controllers.Basic;
const BalanceModel = require('../models/Balance');

class Admin extends Basic {
    async incrementBalance({ accountId, assetTypeId, assetUniqueId, amount }) {
        const model = await this._getBalanceModel({ accountId, assetTypeId, assetUniqueId });

        model.amount = model.amount.plus(amount);
        await model.save();

        // TODO Log to feed.
    }

    async decrementBalance({ accountId, assetTypeId, assetUniqueId, amount }) {
        const model = await this._getBalanceModel({ accountId, assetTypeId, assetUniqueId });

        model.amount = model.amount.minus(amount);
        await model.save();

        // TODO Log to feed.
    }

    async openExchange() {
        // TODO -
        // TODO Log to feed.
    }

    async editExchange() {
        // TODO -
        // TODO Log to feed.
    }

    async closeExchange() {
        // TODO -
        // TODO Log to feed.
    }

    async _getBalanceModel({ accountId, assetTypeId, assetUniqueId }) {
        let model = await BalanceModel.findOne({
            accountId,
            assetTypeId,
            assetUniqueId,
        });

        if (!model) {
            model = new BalanceModel({
                accountId,
                assetTypeId,
                assetUniqueId,
            });
        }

        return model;
    }
}

module.exports = Admin;
