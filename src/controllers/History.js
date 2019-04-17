const core = require('gls-core-service');
const Basic = core.controllers.Basic;
const HistoryModel = require('../models/History');

class History extends Basic {
    async get({ sequenceKey, limit }) {
        throw { code: 501, message: 'Not implemented' };

        // TODO -
    }

    async getFor({ accountId, assetTypeId, sequenceKey, limit }) {
        throw { code: 501, message: 'Not implemented' };

        // TODO -
    }

    async getForAll({ assetTypeId, sequenceKey, limit }) {
        throw { code: 501, message: 'Not implemented' };

        // TODO -
    }

    async getBy({ eventId }) {
        const model = await HistoryModel.findOne(
            { eventId },
            { __v: false, _id: false, updatedAt: false },
            { lean: true }
        );

        if (!model) {
            throw { code: 404, message: 'Event not found' };
        }

        return model;
    }

    async addHook({ url, assetTypeId }) {
        throw { code: 501, message: 'Not implemented' };

        // TODO -
    }

    async removeHook({ hookId }) {
        throw { code: 501, message: 'Not implemented' };

        // TODO -
    }
}

module.exports = History;
