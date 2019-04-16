const core = require('gls-core-service');
const Basic = core.controllers.Basic;
const AssetModel = require('../models/Asset');
const BalanceModel = require('../models/Balance');
const HistoryUtil = require('../utils/History');

class Balance extends Basic {
    async get({ service: { accountId } }) {
        return await this.getFor({ accountId });
    }

    async getFor({ accountId }) {
        const models = await BalanceModel.find(
            { accountId },
            { __v: false, _id: false, createdAt: false, updatedAt: false, accountId: false },
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
        this._checkTargetAccountDuplicate(accountId, targetAccountId);

        const asset = await AssetModel.findOne(
            { assetTypeId },
            { frozen: true, transferable: true, unique: true }
        );

        this._checkAssetExists(asset);
        this._checkAssetFrozen(asset);
        this._checkTransferable(asset);
        this._checkUnique(asset, amount);

        const identificationFrom = { accountId, assetTypeId, assetUniqueId };
        const balanceFrom = await this._getBalanceModelForSend(identificationFrom);

        this._checkBalanceExists(balanceFrom);
        this._checkBalanceChangeResult(balanceFrom, amount);
        this._checkBalanceFrozen(balanceFrom);

        const identificationTo = { accountId: targetAccountId, assetTypeId, assetUniqueId };
        const balanceTo = await this._getBalanceModelForSend(identificationTo, true);

        this._checkBalanceFrozen(balanceTo);

        await this._decrementBalance(balanceFrom, amount);
        await this._incrementBalance(balanceTo, amount);

        // TODO Log to feed
    }

    async incrementBalance({ accountId, assetTypeId, assetUniqueId, amount }) {
        const asset = await this._getAssetModelForSupplyManipulation(assetTypeId);

        this._checkUnique(asset, amount);

        const identification = { accountId, assetTypeId, assetUniqueId };
        const balance = await this._getBalanceModelForAmountManipulation(identification);

        balance.amount += amount;
        await balance.save();

        asset.maxSupply += amount;
        await asset.save();

        // TODO Log to feed
    }

    async decrementBalance({ accountId, assetTypeId, assetUniqueId, amount }) {
        const asset = await this._getAssetModelForSupplyManipulation(assetTypeId);

        this._checkUnique(asset, amount);

        const identification = { accountId, assetTypeId, assetUniqueId };
        const balance = await this._getBalanceModelForAmountManipulation(identification);

        balance.amount -= amount;

        if (balance.amount < 0) {
            throw { code: 400, message: 'Balance less than 0' };
        }

        await balance.save();

        asset.maxSupply -= amount;
        await asset.save();

        // TODO Log to feed
    }

    async freezeAccount({ accountId }) {
        const models = await this._getBalanceModelsForFrozenManipulation(accountId);

        for (const model of models) {
            model.frozen = true;

            await model.save();
        }

        // TODO Log to feed
    }

    async unfreezeAccount({ accountId }) {
        const models = await this._getBalanceModelsForFrozenManipulation(accountId);

        for (const model of models) {
            model.frozen = false;

            await model.save();
        }

        // TODO Log to feed
    }

    async _getBalanceModelsForFrozenManipulation(accountId) {
        const models = await BalanceModel.find({ accountId }, { frozen: true });

        if (!models || !models.length) {
            throw { code: 404, message: 'Account not found' };
        }

        return models;
    }

    async _getAssetModelForSupplyManipulation(assetTypeId) {
        const model = await AssetModel.findOne({ assetTypeId }, { maxSupply: true, unique: true });

        if (!model) {
            throw { code: 404, message: 'Asset not found' };
        }

        return model;
    }

    async _getBalanceModelForAmountManipulation(identification) {
        let model = await BalanceModel.findOne(identification, { amount: true });

        if (!model) {
            model = new BalanceModel(identification);
        }

        return model;
    }

    _checkAssetFrozen(asset) {
        if (asset.frozen) {
            throw { code: 403, message: 'Asset frozen' };
        }
    }

    _checkBalanceFrozen(balance) {
        if (balance.frozen) {
            throw { code: 403, message: 'Balance frozen' };
        }
    }

    _checkTransferable(asset) {
        if (!asset.transferable) {
            throw { code: 403, message: 'Asset not transferable' };
        }
    }

    _checkUnique(asset, amount) {
        if (asset.unique && amount !== 1) {
            throw { code: 403, message: 'Amount greater then 1 for unique asset item' };
        }
    }

    _checkTargetAccountDuplicate(from, to) {
        if (from === to) {
            throw { code: 409, message: 'Source account equivalent target account' };
        }
    }

    _checkAssetExists(asset) {
        if (!asset) {
            throw { code: 404, message: 'Asset not found' };
        }
    }

    _checkBalanceExists(balance) {
        if (!balance) {
            throw { code: 404, message: 'Balance not found' };
        }
    }

    _checkBalanceChangeResult(balance, amount) {
        if (balance.amount - amount < 0) {
            throw { code: 406, message: 'Result balance amount < 0' };
        }
    }

    async _getBalanceModelForSend(identification, createIfNotExists) {
        let model = await BalanceModel.findOne(identification, { frozen: true, amount: true });

        if (!model && createIfNotExists) {
            model = new BalanceModel(identification);
        }

        return model;
    }

    async _decrementBalance(balance, amount) {
        balance.amount -= amount;

        await balance.save();
    }

    async _incrementBalance(balance, amount) {
        balance.amount += amount;

        await balance.save();
    }
}

module.exports = Balance;
