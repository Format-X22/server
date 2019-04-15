const core = require('gls-core-service');
const MongoDB = core.services.MongoDB;

module.exports = MongoDB.makeModel(
    'Asset',
    {
        assetTypeId: {
            type: String,
        },
        shortName: {
            type: String,
        },
        fullName: {
            type: String,
        },
        description: {
            type: String,
        },
        decimals: {
            type: Number,
        },
        maxSupply: {
            type: Number,
        },
        logo: {
            type: String,
        },
        unique: {
            type: Boolean,
        },
        transferable: {
            type: Boolean,
        },
        frozen: {
            type: Boolean,
        },
    },
    {
        index: [
            // Default
            {
                fields: {
                    assetTypeId: 1,
                },
                options: {
                    unique: true,
                },
            },
        ],
    }
);
