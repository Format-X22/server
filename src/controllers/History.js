const core = require('gls-core-service');
const Basic = core.controllers.Basic;
const HistoryModel = require('../models/History');

class History extends Basic {
    async get({ sequenceKey, limit, assetTypeId, accountId }) {
        const query = {};
        const projection = {
            _id: false,
            __v: false,
            updatedAt: false,
            affectedAccounts: false,
            affectedAssets: false,
        };
        const options = { limit, lean: true, sort: { createdAt: -1 } };

        if (sequenceKey) {
            query.createdAt = { $lt: sequenceKey };
        }

        if (assetTypeId) {
            query.affectedAssets = assetTypeId;
        }

        if (accountId) {
            query.affectedAccounts = accountId;
        }

        const items = await HistoryModel.find(query, projection, options);

        if (!items) {
            return this._makeEmptyResult();
        }

        if (items.length < limit) {
            return this._makeFinalResult(items);
        }

        const resultSequenceKey = this._makeSequenceKey(items);

        return this._makeFullResult(items, resultSequenceKey);
    }

    async getPersonal({ service, ...args }) {
        return await this.get({ service, ...args, accountId: service.accountId });
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

    _makeSequenceKey(items) {
        const lastCreatedAt = items[items.length - 1].createdAt;

        return Number(lastCreatedAt);
    }

    _makeEmptyResult() {
        return this._makeFullResult([], null);
    }

    _makeFinalResult(items) {
        return this._makeFullResult(items, null);
    }

    _makeFullResult(items, sequenceKey) {
        return {
            items,
            sequenceKey,
        };
    }
}

module.exports = History;
