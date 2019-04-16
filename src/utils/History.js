const uuid = require('uuid');
const HistoryModel = require('../models/History');

class History {
    static async log(eventType, eventName, eventScope) {
        await HistoryModel.create({
            eventId: uuid.v4(),
            eventType,
            eventName,
            eventScope,
        });
    }
}

module.exports = History;
