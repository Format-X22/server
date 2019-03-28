const merge = require('deepmerge'); // TODO Remove from package
const core = require('gls-core-service');
const BasicConnector = core.services.Connector;
const Admin = require('../controllers/Admin');
const Balance = require('../controllers/Balance');
const Exchange = require('../controllers/Exchange');
const History = require('../controllers/History');
const Auth = require('../utils/Auth'); // TODO -

const NUMBER_ID_VALIDATION = {
    type: 'number',
    minValue: 0,
};
const UID_VALIDATION = {
    type: 'string',
    maxLength: 256,
};
const ACCOUNT_VALIDATION = {
    type: 'string',
    pattern: '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$',
};
const BASIC_VALIDATION = {
    type: 'object',
    additionalProperties: false,
    required: ['service'],
    properties: {
        service: {
            type: 'object',
            additionalProperties: false,
            required: ['version', 'account', 'sign', 'identityKey', 'timestamp'],
            properties: {
                version: NUMBER_ID_VALIDATION,
                account: ACCOUNT_VALIDATION,
                identityKey: UID_VALIDATION,
                sign: { type: 'string', maxLength: 1024 },
                timestamp: { type: 'number', minValue: 1553000000000 },
            },
        },
    },
};

// TODO Check auth + identity
// TODO Preprocessors + basic preprocessors with off flag
// TODO Basic validation with defaults from core
class Connector extends BasicConnector {
    constructor({ identityService }) {
        super();

        const linking = { connector: this };

        this._admin = new Admin(linking);
        this._balance = new Balance(linking);
        this._exchange = new Exchange(linking);
        this._history = new History(linking);

        this._identity = identityService; // TODO -
    }

    async start() {
        await super.start({
            serverRoutes: {
                'balance.get': {
                    handler: this._balance.get,
                    scope: this._balance,
                    validation: BASIC_VALIDATION,
                },
                'balance.getFor': {
                    handler: this._balance.getFor,
                    scope: this._balance,
                    validation: merge(BASIC_VALIDATION, {
                        required: ['targetAccount'],
                        properties: {
                            targetAccount: ACCOUNT_VALIDATION,
                        },
                    }),
                },
                'balance.send': {
                    handler: this._balance.send,
                    scope: this._balance,
                    validation: merge(BASIC_VALIDATION, {
                        required: ['targetAccount'],
                        properties: {
                            targetAccount: ACCOUNT_VALIDATION,
                            exchangeId: UID_VALIDATION,
                            message: { type: 'string', maxLength: 2048 },
                        },
                    }),
                },
                'exchange.request': {
                    handler: this._exchange.request,
                    scope: this._exchange,
                    validation: merge(BASIC_VALIDATION, {
                        // TODO -
                    }),
                },
                'exchange.approve': {
                    handler: this._exchange.approve,
                    scope: this._exchange,
                    validation: merge(BASIC_VALIDATION, {
                        // TODO -
                    }),
                },
                'history.get': {
                    handler: this._history.get,
                    scope: this._history,
                    validation: merge(BASIC_VALIDATION, {
                        properties: {
                            sequenceKey: UID_VALIDATION,
                        },
                    }),
                },
                'history.getFor': {
                    handler: this._history.getFor,
                    scope: this._history,
                    validation: merge(BASIC_VALIDATION, {
                        required: ['targetAccount'],
                        properties: {
                            sequenceKey: UID_VALIDATION,
                            targetAccount: ACCOUNT_VALIDATION,
                        },
                    }),
                },
                'history.getForAll': {
                    handler: this._history.getForAll,
                    scope: this._history,
                    validation: merge(BASIC_VALIDATION, {
                        properties: {
                            sequenceKey: UID_VALIDATION,
                        },
                    }),
                },
                'history.getBy': {
                    handler: this._history.getBy,
                    scope: this._history,
                    validation: merge(BASIC_VALIDATION, {
                        required: ['transactionId'],
                        properties: {
                            transactionId: NUMBER_ID_VALIDATION,
                        },
                    }),
                },
                'admin.openExchange': {
                    handler: this._admin.openExchange,
                    scope: this._admin,
                    validation: merge(BASIC_VALIDATION, {
                        // TODO -
                    }),
                },
                'admin.editExchange': {
                    handler: this._admin.editExchange,
                    scope: this._admin,
                    validation: merge(BASIC_VALIDATION, {
                        // TODO -
                    }),
                },
                'admin.closeExchange': {
                    handler: this._admin.closeExchange,
                    scope: this._admin,
                    validation: merge(BASIC_VALIDATION, {
                        // TODO -
                    }),
                },
            },
        });
    }
}

module.exports = Connector;
