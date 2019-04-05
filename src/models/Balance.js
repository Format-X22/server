const core = require('gls-core-service');
const MongoDB = core.services.MongoDB;
const MongoBigNum = core.types.MongoBigNum;
const BigNum = core.types.BigNum;

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
            default: new BigNum('0'),
        },
    },
    {
        index: [
            {
                // Find for user
                fields: {
                    accountId: 1,
                },
            },
            {
                // Find current
                fields: {
                    accountId: 1,
                    assetTypeId: 1,
                    assetUniqueId: 1,
                },
            },
        ],
    }
);
