const uuid = require('uuid');
const core = require('gls-core-service');
const Basic = core.controllers.Basic;
const env = require('../data/env');
const AssetModel = require('../models/Asset');
const BalanceModel = require('../models/Balance');
const HistoryUtil = require('../utils/History');

class Asset extends Basic {
    async getList({}) {
        const models = await AssetModel.find(
            {},
            { __v: false, _id: false, createdAt: false, updatedAt: false },
            { lean: true }
        );

        return {
            data: models || [],
        };
    }

    async createAsset({
        service: { accountId: adminAccountId },
        shortName,
        fullName,
        description,
        decimals,
        maxSupply,
        logo,
        unique,
        transferable,
        frozen,
    }) {
        if (await AssetModel.countDocuments({ shortName })) {
            throw { code: 409, message: 'Duplicated asset short name' };
        }

        if (unique && maxSupply) {
            throw { code: 409, message: 'Unique with maxSupply not allowed' };
        }

        const assetTypeId = uuid.v4();

        await AssetModel.create({
            assetTypeId,
            shortName,
            fullName,
            description,
            decimals,
            maxSupply,
            logo,
            unique,
            transferable,
            frozen,
        });

        if (!unique) {
            await this._createStartAdminBalance(assetTypeId, maxSupply);
        }

        await HistoryUtil.add({
            eventType: 'asset',
            eventName: 'create',
            eventScope: {
                assetTypeId,
                shortName,
                unique,
                transferable,
                frozen,
                maxSupply,
            },
            affectedAccounts: [adminAccountId],
            affectedAssets: [assetTypeId],
        });

        return {
            assetTypeId,
        };
    }

    async destroyAsset({ service: { accountId: adminAccountId }, assetTypeId }) {
        await AssetModel.remove({ assetTypeId });

        await HistoryUtil.add({
            eventType: 'asset',
            eventName: 'destroy',
            eventScope: {
                assetTypeId,
            },
            affectedAccounts: [adminAccountId],
            affectedAssets: [assetTypeId],
        });
    }

    async freezeAsset({ service: { accountId: adminAccountId }, assetTypeId }) {
        const model = await this._tryGetModelForFrozenManipulation(assetTypeId);

        model.frozen = true;

        await model.save();

        await HistoryUtil.add({
            eventType: 'asset',
            eventName: 'freeze',
            eventScope: {
                assetTypeId,
            },
            affectedAccounts: [adminAccountId],
            affectedAssets: [assetTypeId],
        });
    }

    async unfreezeAsset({ service: { accountId: adminAccountId }, assetTypeId }) {
        const model = await this._tryGetModelForFrozenManipulation(assetTypeId);

        model.frozen = true;

        await model.save();

        await HistoryUtil.add({
            eventType: 'asset',
            eventName: 'unfreeze',
            eventScope: {
                assetTypeId,
            },
            affectedAccounts: [adminAccountId],
            affectedAssets: [assetTypeId],
        });
    }

    async _tryGetModelForFrozenManipulation(assetTypeId) {
        const model = await AssetModel.findOne({ assetTypeId }, { frozen: true });

        if (!model) {
            throw { code: 404, message: 'Not found' };
        }

        return model;
    }

    async _createStartAdminBalance(assetTypeId, amount) {
        await BalanceModel.create({
            accountId: env.DS_ADMIN_ACCOUNT_ID,
            assetTypeId,
            assetUniqueId: '',
            amount,
        });
    }
}

module.exports = Asset;
