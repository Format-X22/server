const uuid = require('uuid');
const core = require('gls-core-service');
const Basic = core.controllers.Basic;
const AssetModel = require('../models/Asset');
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

        await HistoryUtil.add('asset', 'create', {
            assetTypeId,
            shortName,
            unique,
            transferable,
            frozen,
        });

        return {
            assetTypeId,
        };
    }

    async destroyAsset({ assetTypeId }) {
        await AssetModel.remove({ assetTypeId });

        await HistoryUtil.add('asset', 'destroy', {
            assetTypeId,
        });
    }

    async freezeAsset({ assetTypeId }) {
        const model = await this._tryGetModelForFrozenManipulation(assetTypeId);

        model.frozen = true;

        await model.save();

        await HistoryUtil.add('asset', 'freeze', {
            assetTypeId,
        });
    }

    async unfreezeAsset({ assetTypeId }) {
        const model = await this._tryGetModelForFrozenManipulation(assetTypeId);

        model.frozen = true;

        await model.save();

        await HistoryUtil.add('asset', 'unfreeze', {
            assetTypeId,
        });
    }

    async _tryGetModelForFrozenManipulation(assetTypeId) {
        const model = await AssetModel.findOne({ assetTypeId }, { frozen: true });

        if (!model) {
            throw { code: 404, message: 'Not found' };
        }

        return model;
    }
}

module.exports = Asset;
