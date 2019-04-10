const core = require('gls-core-service');
const Basic = core.controllers.Basic;

class Asset extends Basic {
    async getList({}) {
        // TODO -
    }

    async createAsset({ shortName, fullName, maxSupply, logo, unique, transferable, frozen }) {
        // TODO -
        // TODO Log to feed.
    }

    async destroyAsset({ assetTypeId }) {
        // TODO -
        // TODO Log to feed.
    }

    async freezeAsset({ assetTypeId }) {
        // TODO Check assetType
        // TODO -
        // TODO Log to feed.
    }

    async unfreezeAsset({ assetTypeId }) {
        // TODO Check assetType
        // TODO -
        // TODO Log to feed.
    }
}

module.exports = Asset;
