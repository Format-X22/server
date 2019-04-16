const core = require('gls-core-service');
const MongoDB = core.services.MongoDB;

module.exports = MongoDB.makeModel(
    'Balance',
    {
        accountId: {
            type: String,
        },
        assetTypeId: {
            type: String,
        },
        assetUniqueId: {
            type: String,
        },
        amount: {
            type: Number,
            default: 0,
        },
        frozen: {
            type: Boolean,
            default: false,
        },
    },
    {
        index: [
            {
                // Find all user balances
                fields: {
                    accountId: 1,
                },
            },
            {
                // Find one balance
                fields: {
                    accountId: 1,
                    assetTypeId: 1,
                    assetUniqueId: 1,
                },
            },
        ],
    }
);
