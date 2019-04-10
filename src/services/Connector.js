const core = require('gls-core-service');
const BasicConnector = core.services.Connector;
const env = require('../data/env');
const Balance = require('../controllers/Balance');
const Exchange = require('../controllers/Exchange');
const History = require('../controllers/History');
const Asset = require('../controllers/Asset');
const Auth = require('../utils/Auth');

class Connector extends BasicConnector {
    constructor({ identityService }) {
        super();

        const linking = { connector: this };

        this._balance = new Balance(linking);
        this._exchange = new Exchange(linking);
        this._history = new History(linking);
        this._asset = new Asset(linking);

        this._identity = identityService;
        this._auth = new Auth();
    }

    async start() {
        await super.start({
            serverRoutes: {
                /**
                 * ===== ASSET API SECTION =====
                 **/
                'asset.getList': {
                    inherits: ['service'],
                    handler: this._asset.getList,
                    scope: this._asset,
                    validation: {},
                },
                'admin.asset.createAsset': {
                    inherits: ['adminOnly', 'service'],
                    handler: this._asset.createAsset,
                    scope: this._asset,
                    validation: {
                        required: ['shortName', 'fullName', 'maxSupply'],
                        properties: {
                            shortName: {
                                type: 'string',
                                minLength: 1,
                                maxLength: 16,
                            },
                            fullName: {
                                type: 'string',
                                minLength: 1,
                                maxLength: 256,
                            },
                            maxSupply: {
                                type: ['number', 'string'],
                            },
                            logo: {
                                type: 'string',
                                maxLength: 65536,
                            },
                            unique: {
                                type: 'boolean',
                                default: false,
                            },
                            transferable: {
                                type: 'boolean',
                                default: true,
                            },
                            frozen: {
                                type: 'boolean',
                                default: false,
                            },
                        },
                    },
                },
                'admin.asset.destroyAsset': {
                    inherits: ['adminOnly', 'service'],
                    handler: this._asset.destroyAsset,
                    scope: this._asset,
                    validation: {
                        required: ['assetTypeId'],
                        properties: {
                            assetTypeId: {
                                type: 'uid',
                            },
                        },
                    },
                },
                'admin.asset.freezeAsset': {
                    inherits: ['adminOnly', 'service'],
                    handler: this._asset.freezeAsset,
                    scope: this._asset,
                    validation: {
                        required: ['assetTypeId'],
                        properties: {
                            assetTypeId: {
                                type: 'uid',
                            },
                        },
                    },
                },
                'admin.asset.unfreezeAsset': {
                    inherits: ['adminOnly', 'service'],
                    handler: this._asset.unfreezeAsset,
                    scope: this._asset,
                    validation: {
                        required: ['assetTypeId'],
                        properties: {
                            assetTypeId: {
                                type: 'uid',
                            },
                        },
                    },
                },

                /**
                 * ===== BALANCE API SECTION =====
                 **/
                'balance.get': {
                    inherits: ['service'],
                    handler: this._balance.get,
                    scope: this._balance,
                    validation: {},
                },
                'balance.getFor': {
                    inherits: ['service'],
                    handler: this._balance.getFor,
                    scope: this._balance,
                    validation: {
                        required: ['accountId'],
                        properties: {
                            accountId: {
                                type: 'accountId',
                            },
                        },
                    },
                },
                'balance.send': {
                    inherits: ['service', 'balanceManipulation'],
                    handler: this._balance.send,
                    scope: this._balance,
                    validation: {
                        properties: {
                            exchangeId: {
                                type: 'uid',
                            },
                            message: {
                                type: 'string',
                                maxLength: 2048,
                            },
                        },
                    },
                },
                'admin.balance.incrementBalance': {
                    inherits: ['adminOnly', 'service', 'balanceManipulation'],
                    handler: this._balance.incrementBalance,
                    scope: this._balance,
                    validation: {},
                },
                'admin.balance.decrementBalance': {
                    inherits: ['adminOnly', 'service', 'balanceManipulation'],
                    handler: this._balance.decrementBalance,
                    scope: this._balance,
                    validation: {},
                },
                'admin.balance.freezeAccount': {
                    inherits: ['adminOnly', 'service'],
                    handler: this._balance.freezeAccount,
                    scope: this._balance,
                    validation: {
                        required: ['accountId'],
                        properties: {
                            accountId: {
                                type: 'accountId',
                            },
                        },
                    },
                },
                'admin.balance.unfreezeAccount': {
                    inherits: ['adminOnly', 'service'],
                    handler: this._balance.unfreezeAccount,
                    scope: this._balance,
                    validation: {
                        required: ['accountId'],
                        properties: {
                            accountId: {
                                type: 'accountId',
                            },
                        },
                    },
                },

                /**
                 * ===== EXCHANGE API SECTION =====
                 **/
                'exchange.request': {
                    inherits: ['service', 'exchangePair'],
                    handler: this._exchange.request,
                    scope: this._exchange,
                    validation: {
                        properties: {
                            what: {
                                required: ['amount'],
                                properties: {
                                    amount: {
                                        type: ['string', 'number'],
                                        maxLength: 128,
                                    },
                                },
                            },
                            forWhat: {
                                required: ['amount'],
                                properties: {
                                    amount: {
                                        type: ['string', 'number'],
                                        maxLength: 128,
                                    },
                                },
                            },
                        },
                    },
                },
                'exchange.take': {
                    inherits: ['service'],
                    handler: this._exchange.take,
                    scope: this._exchange,
                    validation: {
                        required: ['exchangeId'],
                        properties: {
                            exchangeId: {
                                type: 'uid',
                            },
                        },
                    },
                },
                'exchange.approve': {
                    inherits: ['service'],
                    handler: this._exchange.approve,
                    scope: this._exchange,
                    validation: {
                        required: ['exchangeId'],
                        properties: {
                            exchangeId: {
                                type: 'uid',
                            },
                        },
                    },
                },
                'exchange.cancel': {
                    inherits: ['service'],
                    handler: this._exchange.cancel,
                    scope: this._exchange,
                    validation: {
                        required: ['exchangeId'],
                        properties: {
                            exchangeId: {
                                type: 'uid',
                            },
                        },
                    },
                },
                'exchange.getAssetTypes': {
                    inherits: ['service'],
                    handler: this._exchange.getAssetTypes,
                    scope: this._exchange,
                    validation: {},
                },
                'exchange.getRequests': {
                    inherits: ['service', 'sequence'],
                    handler: this._exchange.getRequests,
                    scope: this._exchange,
                    validation: {
                        required: ['assetTypeId'],
                        properties: {
                            assetTypeId: {
                                type: 'uid',
                            },
                        },
                    },
                },
                'admin.exchange.openExchangeMarket': {
                    inherits: ['adminOnly', 'service', 'exchangePair', 'exchangeMarketProperties'],
                    handler: this._exchange.openExchangeMarket,
                    scope: this._exchange,
                    validation: {},
                },
                'admin.exchange.editExchangeMarket': {
                    inherits: ['adminOnly', 'service', 'exchangeMarketProperties'],
                    handler: this._exchange.editExchangeMarket,
                    scope: this._exchange,
                    validation: {
                        properties: {
                            exchangeMarketId: {
                                type: 'uid',
                            },
                        },
                    },
                },
                'admin.exchange.closeExchangeMarket': {
                    inherits: ['adminOnly', 'service'],
                    handler: this._exchange.closeExchangeMarket,
                    scope: this._exchange,
                    validation: {
                        required: ['exchangeMarketId'],
                        properties: {
                            exchangeMarketId: {
                                type: 'uid',
                            },
                        },
                    },
                },

                /**
                 * ===== HISTORY API SECTION =====
                 **/
                'history.get': {
                    inherits: ['service', 'sequence'],
                    handler: this._history.get,
                    scope: this._history,
                    validation: {},
                },
                'history.getFor': {
                    inherits: ['service', 'sequence'],
                    handler: this._history.getFor,
                    scope: this._history,
                    validation: {
                        required: ['accountId'],
                        properties: {
                            accountId: {
                                type: 'accountId',
                            },
                            assetTypeId: {
                                type: 'uid',
                            },
                        },
                    },
                },
                'history.getForAll': {
                    inherits: ['service', 'sequence'],
                    handler: this._history.getForAll,
                    scope: this._history,
                    validation: {
                        properties: {
                            assetTypeId: {
                                type: 'uid',
                            },
                        },
                    },
                },
                'history.getBy': {
                    inherits: ['service'],
                    handler: this._history.getBy,
                    scope: this._history,
                    validation: {
                        required: ['transactionId'],
                        properties: {
                            transactionId: {
                                type: 'numberId',
                            },
                        },
                    },
                },
                'admin.history.addHook': {
                    inherits: ['service'],
                    handler: this._history.addHook,
                    scope: this._history,
                    validation: {
                        required: ['url'],
                        properties: {
                            url: {
                                type: 'string',
                                maxLength: 2048,
                            },
                            assetTypeId: {
                                type: 'uid',
                            },
                        },
                    },
                },
                'admin.history.removeHook': {
                    inherits: ['service'],
                    handler: this._history.removeHook,
                    scope: this._history,
                    validation: {
                        required: ['url'],
                        properties: {
                            hookId: {
                                type: 'numberId',
                            },
                        },
                    },
                },
            },
            serverDefaults: {
                parents: {
                    adminOnly: {
                        before: [
                            {
                                handler: this._auth.checkAdminAccess,
                                scope: this._auth,
                            },
                        ],
                    },
                    service: {
                        before: [
                            {
                                handler: this._auth.verify,
                                scope: this._auth,
                            },
                            {
                                handler: this._identity.verify,
                                scope: this._identity,
                            },
                        ],
                        after: [
                            {
                                handler: this._auth.signResponse,
                                scope: this._auth,
                            },
                        ],
                        validation: {
                            required: ['service'],
                            properties: {
                                service: {
                                    type: 'object',
                                    additionalProperties: false,
                                    required: [
                                        'publicKey',
                                        'sign',
                                        'identityKey',
                                        'timestamp',
                                    ],
                                    properties: {
                                        publicKey: {
                                            type: 'string',
                                            maxLength: 1024,
                                        },
                                        identityKey: {
                                            type: 'uid',
                                        },
                                        sign: {
                                            type: 'string',
                                            maxLength: 1024,
                                        },
                                        timestamp: {
                                            type: 'number',
                                            minValue: 1553000000000,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    sequence: {
                        validation: {
                            properties: {
                                sequenceKey: {
                                    type: ['string', 'null'],
                                    default: null,
                                    maxLength: 256,
                                },
                                limit: {
                                    type: 'number',
                                    default: 10,
                                    minValue: 1,
                                    maxValue: env.DS_MAX_HISTORY_LIMIT,
                                },
                            },
                        },
                    },
                    balanceManipulation: {
                        validation: {
                            required: ['accountId', 'assetTypeId', 'amount'],
                            properties: {
                                accountId: {
                                    type: 'accountId',
                                },
                                assetTypeId: {
                                    type: 'uid',
                                },
                                assetUniqueId: {
                                    type: 'uid',
                                },
                                amount: {
                                    type: ['string', 'number'],
                                    maxLength: 128,
                                },
                            },
                        },
                    },
                    exchangePair: {
                        validation: {
                            properties: {
                                what: {
                                    type: 'object',
                                    additionalProperties: false,
                                    required: ['assetTypeId'],
                                    properties: {
                                        assetTypeId: {
                                            type: 'uid',
                                        },
                                        assetUniqueId: {
                                            type: 'uid',
                                        },
                                    },
                                },
                                forWhat: {
                                    type: 'object',
                                    additionalProperties: false,
                                    required: ['assetTypeId'],
                                    properties: {
                                        assetTypeId: {
                                            type: 'uid',
                                        },
                                        assetUniqueId: {
                                            type: 'uid',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    exchangeMarketProperties: {
                        validation: {
                            what: {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                    maxTotalAmount: {
                                        type: ['string', 'number'],
                                        maxLength: 128,
                                    },
                                },
                            },
                            forWhat: {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                    maxTotalAmount: {
                                        type: ['string', 'number'],
                                        maxLength: 128,
                                    },
                                },
                            },
                        },
                    },
                },
                validationTypes: {
                    numberId: {
                        type: 'number',
                        minValue: 0,
                    },
                    uid: {
                        type: 'string',
                        maxLength: 256,
                        default: '',
                    },
                    accountId: {
                        type: 'string',
                        pattern: '^ID[0-9a-fA-F]{64}$',
                    },
                },
            },
        });
    }
}

module.exports = Connector;
