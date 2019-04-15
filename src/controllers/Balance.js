const core = require('gls-core-service');
const Basic = core.controllers.Basic;
const BigNum = core.types.BigNum;
const BalanceModel = require('../models/Balance');

class Balance extends Basic {
    async get({ service: { accountId } }) {
        return await this.getFor({ accountId });
    }

    async getFor({ accountId }) {
        const models = await BalanceModel.find(
            { accountId },
            { __v: false, _id: false },
            { lean: true }
        );

        if (!models) {
            throw { code: 404, message: 'Not found' };
        }

        return {
            balances: models,
        };
    }

    // TODO Return transactionId
    async send({
        service: { accountId },
        accountId: targetAccountId,
        assetTypeId,
        assetUniqueId,
        exchangeId,
        amount,
        message,
    }) {
        amount = new BigNum(amount);

        // TODO Check asset freeze
        // TODO Check account freeze

        this._checkTarget(accountId, targetAccountId);
        this._checkSendAmount(amount);
        await this._checkTransferable(assetTypeId);
        await this._decrementBalance(
            { accountId, assetTypeId, assetUniqueId },
            { amount, exchangeId, message }
        );
        await this._incrementBalance(
            { accountId: targetAccountId, assetTypeId, assetUniqueId },
            { amount, exchangeId, message }
        );
    }

    async incrementBalance({ accountId, assetTypeId, assetUniqueId, amount }) {
        // TODO Check assetType

        const model = await this._getBalanceModel({ accountId, assetTypeId, assetUniqueId });

        model.amount = model.amount.plus(amount);
        await model.save();

        // TODO Change max supply
        // TODO Log to feed.
    }

    async decrementBalance({ accountId, assetTypeId, assetUniqueId, amount }) {
        // TODO Check assetType

        const model = await this._getBalanceModel({ accountId, assetTypeId, assetUniqueId });

        model.amount = model.amount.minus(amount);
        await model.save();

        // TODO Change max supply
        // TODO Log to feed.
    }

    async freezeAccount({ accountId }) {
        // TODO -
        // TODO Log to feed.
    }

    async unfreezeAccount({ accountId }) {
        // TODO -
        // TODO Log to feed.
    }

    _checkTarget(accountId, targetAccountId) {
        if (accountId === targetAccountId) {
            throw { code: 400, message: 'accountId == targetAccountId' };
        }
    }

    _checkSendAmount(amount) {
        if (amount.lte(0)) {
            throw { code: 400, message: 'Amount <= 0' };
        }
    }

    async _checkTransferable(assetTypeId) {
        // TODO -
    }

    async _decrementBalance(query, { amount, exchangeId, message }) {
        const modelFrom = await BalanceModel.findOne(query);

        if (!modelFrom) {
            throw { code: 400, message: 'Account without balance' };
        }

        modelFrom.amount = modelFrom.amount.minus(amount);

        if (modelFrom.amount.lt(0)) {
            throw { code: 400, message: 'Account amount < 0' };
        }

        await modelFrom.save();

        // TODO Log to feed.
    }

    async _incrementBalance(query, { amount, exchangeId, message }) {
        let modelTo = await BalanceModel.findOne(query);

        if (!modelTo) {
            modelTo = new BalanceModel(query);
        }

        modelTo.amount = modelTo.amount.plus(amount);

        await modelTo.save();

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

module.exports = Balance;
