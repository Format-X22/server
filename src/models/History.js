const core = require('gls-core-service');
const MongoDB = core.services.MongoDB;

module.exports = MongoDB.makeModel(
    'History',
    {
        eventId: {
            type: String,
        },
        eventType: {
            type: String,
        },
        eventName: {
            type: String,
        },
        eventScope: {
            type: Object,
        },
        affectedAssets: {
            type: [String],
        },
        affectedAccounts: {
            type: [String],
        },
    },
    {
        index: [
            {
                // Search
                fields: {
                    eventId: 1,
                },
            },
            {
                // History sorting
                fields: {
                    createdAt: -1,
                },
            },
        ],
    }
);
