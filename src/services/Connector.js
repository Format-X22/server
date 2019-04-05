const core = require('gls-core-service');
const BasicConnector = core.services.Connector;
const env = require('../data/env');
const Admin = require('../controllers/Admin');
const Balance = require('../controllers/Balance');
const Exchange = require('../controllers/Exchange');
const History = require('../controllers/History');
const Auth = require('../utils/Auth');

// TODO Core validation types
const NUMBER_ID_VALIDATION = {
    type: 'number',
    minValue: 0,
};
const UID_VALIDATION = {
    type: 'string',
    maxLength: 256,
    default: '',
};
const ACCOUNT_VALIDATION = {
    type: 'string',
    pattern: '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$',
};

class Connector extends BasicConnector {
    constructor({ identityService }) {
        super();

        const linking = { connector: this };

        this._admin = new Admin(linking);
        this._balance = new Balance(linking);
        this._exchange = new Exchange(linking);
        this._history = new History(linking);

        this._identity = identityService;
        this._auth = new Auth(); // TODO Keys
    }

    async start() {
        await super.start({
            serverRoutes: {
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
                            accountId: ACCOUNT_VALIDATION,
                        },
                    },
                },
                'balance.send': {
                    inherits: ['service', 'balanceManipulation'],
                    handler: this._balance.send,
                    scope: this._balance,
                    validation: {
                        properties: {
                            message: {
                                type: 'string',
                                maxLength: 2048,
                            },
                        },
                    },
                },
                'exchange.request': {
                    inherits: ['service'],
                    handler: this._exchange.request,
                    scope: this._exchange,
                    validation: {
                        // TODO -
                    },
                },
                'exchange.approve': {
                    inherits: ['service'],
                    handler: this._exchange.approve,
                    scope: this._exchange,
                    validation: {
                        // TODO -
                    },
                },
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
                            accountId: ACCOUNT_VALIDATION,
                            assetTypeId: UID_VALIDATION,
                        },
                    },
                },
                'history.getForAll': {
                    inherits: ['service', 'sequence'],
                    handler: this._history.getForAll,
                    scope: this._history,
                    validation: {
                        properties: {
                            assetTypeId: UID_VALIDATION,
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
                            transactionId: NUMBER_ID_VALIDATION,
                        },
                    },
                },
                'admin.incrementBalance': {
                    inherits: ['service', 'balanceManipulation'],
                    handler: this._admin.incrementBalance,
                    scope: this._admin,
                    validation: {},
                },
                'admin.decrementBalance': {
                    inherits: ['service', 'balanceManipulation'],
                    handler: this._admin.decrementBalance,
                    scope: this._admin,
                    validation: {},
                },
                'admin.openExchange': {
                    inherits: ['service'],
                    handler: this._admin.openExchange,
                    scope: this._admin,
                    validation: {
                        // TODO -
                    },
                },
                'admin.editExchange': {
                    inherits: ['service'],
                    handler: this._admin.editExchange,
                    scope: this._admin,
                    validation: {
                        // TODO -
                    },
                },
                'admin.closeExchange': {
                    inherits: ['service'],
                    handler: this._admin.closeExchange,
                    scope: this._admin,
                    validation: {
                        // TODO -
                    },
                },
                'admin.addFeedHook': {
                    inherits: ['service'],
                    handler: this._admin.closeExchange,
                    scope: this._admin,
                    validation: {
                        // TODO -
                    },
                },
            },
            serverDefaults: {
                parents: {
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
                        validation: {
                            required: ['service'],
                            properties: {
                                service: {
                                    type: 'object',
                                    additionalProperties: false,
                                    required: ['accountId', 'sign', 'identityKey', 'timestamp'],
                                    properties: {
                                        accountId: ACCOUNT_VALIDATION,
                                        identityKey: UID_VALIDATION,
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
                                accountId: ACCOUNT_VALIDATION,
                                assetTypeId: UID_VALIDATION,
                                assetUniqueId: UID_VALIDATION,
                                amount: {
                                    type: ['string', 'number'],
                                    maxLength: 128,
                                },
                            },
                        },
                    },
                },
            },
        });
    }
}

module.exports = Connector;
