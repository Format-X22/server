const core = require('gls-core-service');
const BasicConnector = core.services.Connector;
const env = require('../data/env');
const Balance = require('../controllers/Balance');
const Exchange = require('../controllers/Exchange');
const History = require('../controllers/History');
const Asset = require('../controllers/Asset');
const Node = require('../controllers/Node');
const Auth = require('../utils/Auth');

class Connector extends BasicConnector {
    constructor({ identityService }) {
        super();

        const linking = { connector: this };

        this._balance = new Balance(linking);
        this._exchange = new Exchange(linking);
        this._history = new History(linking);
        this._asset = new Asset(linking);
        this._node = new Node(linking);

        this._identity = identityService;
        this._auth = new Auth();
    }

    async start() {
        await super.start({
            serverRoutes: {
                ...this._getNodeApiConfig(),
                ...this._getAssetApiConfig(),
                ...this._getBalanceApiConfig(),
                ...this._getExchangeApiConfig(),
                ...this._getHistoryApiConfig(),
            },
            serverDefaults: {
                parents: this._getParentsConfig(),
                validationTypes: this._getCustomValidationTypes(),
            },
        });
    }

    _getNodeApiConfig() {
        return {
            'node.getInfo': {
                inherits: ['service'],
                handler: this._node.getInfo,
                scope: this._node,
                validation: {},
            },
            'admin.node.setInfo': {
                inherits: ['adminOnly', 'service'],
                handler: this._node.setInfo,
                scope: this._node,
                validation: {
                    properties: {
                        name: {
                            type: 'string',
                            maxLength: 128,
                        },
                        description: {
                            type: 'string',
                            maxLength: 2000,
                        },
                        links: {
                            type: 'array',
                            items: {
                                type: 'string',
                                maxLength: 2048,
                            },
                        },
                        logo: {
                            type: 'string',
                            maxLength: 1048576,
                        },
                    },
                },
            },
            'admin.node.setKnownNodes': {
                inherits: ['adminOnly', 'service'],
                handler: this._node.setKnownNodes,
                scope: this._node,
                validation: {
                    required: ['knownNodes'],
                    properties: {
                        knownNodes: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
            'admin.node.removeKnownNodes': {
                inherits: ['adminOnly', 'service'],
                handler: this._node.removeKnownNodes,
                scope: this._node,
                validation: {
                    required: ['knownNodes'],
                    properties: {
                        knownNodes: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        };
    }

    _getAssetApiConfig() {
        return {
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
                    required: ['shortName'],
                    properties: {
                        shortName: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 16,
                        },
                        fullName: {
                            type: 'string',
                            maxLength: 256,
                        },
                        description: {
                            type: 'string',
                            maxLength: 2000,
                        },
                        decimals: {
                            type: 'integer',
                            default: 0,
                        },
                        maxSupply: {
                            type: 'integer',
                            default: 0,
                        },
                        logo: {
                            type: 'string',
                            maxLength: 1048576,
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
        };
    }

    _getBalanceApiConfig() {
        return {
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
        };
    }

    _getExchangeApiConfig() {
        return {
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
        };
    }

    _getHistoryApiConfig() {
        return {
            'history.get': {
                inherits: ['service', 'sequence'],
                handler: this._history.get,
                scope: this._history,
                validation: {
                    properties: {
                        assetTypeId: {
                            type: 'uid',
                        },
                    },
                },
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
                    properties: {
                        hookId: {
                            type: 'numberId',
                        },
                    },
                },
            },
        };
    }

    _getParentsConfig() {
        return {
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
                            required: ['publicKey', 'sign', 'identityKey', 'timestamp'],
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
                                    type: 'integer',
                                    minimum: 1553000000000,
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
                            type: 'integer',
                            default: 10,
                            minimum: 1,
                            maximum: env.DS_MAX_HISTORY_LIMIT,
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
                            default: '',
                        },
                        amount: {
                            type: 'integer',
                            minimum: 1,
                        },
                    },
                },
            },
            exchangePair: {
                validation: {
                    required: ['what', 'forWhat'],
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
        };
    }

    _getCustomValidationTypes() {
        return {
            numberId: {
                type: 'integer',
                minimum: 0,
            },
            uid: {
                type: 'string',
                maxLength: 256,
            },
            accountId: {
                type: 'string',
                pattern: '^ID[0-9a-fA-F]{64}$',
            },
        };
    }
}

module.exports = Connector;
