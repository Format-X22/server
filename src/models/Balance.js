const core = require('gls-core-service');
const MongoDB = core.services.MongoDB;
const MongoBigNum = core.types.MongoBigNum;

module.exports = MongoDB.makeModel(
    'Balance',
    {
        accountId: {
            type: String,
        },
        assetId: {
            type: String,
        },
        amount: {
            type: MongoBigNum,
        },
    },
    {
        index: [
            {
                fields: {
                    account: 1,
                    pointName: 1,
                },
            },
        ],
    }
);
