const uuid = require('uuid');
const HistoryModel = require('../models/History');

class History {
    static async add({
        eventType,
        eventName,
        eventScope = {},
        affectedAccounts = [],
        affectedAssets = [],
    }) {
        const eventId = uuid.v4();

        await HistoryModel.create({
            eventId,
            eventType,
            eventName,
            eventScope,
            affectedAccounts,
            affectedAssets,
        });

        return eventId;
    }
}

module.exports = History;
