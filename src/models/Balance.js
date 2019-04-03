const core = require('gls-core-service');
const MongoDB = core.services.MongoDB;
const MongoBigNum = core.types.MongoBigNum;

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
            type: MongoBigNum,
            default: '0',
        },
    },
    {
        index: [
            {
                // Search
                fields: {
                    accountId: 1,
                    assetTypeId: 1,
                    assetUniqueId: 1,
                },
            },
        ],
    }
);
