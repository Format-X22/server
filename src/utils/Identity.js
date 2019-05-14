const env = require('../data/env');

class Identity {
    constructor() {
        this._cache = new Set();
    }

    async verify({ service: { timestamp, identityKey } }) {
        const timeEdge = Date.now() - env.DS_IDENTITY_TTL;

        if (timestamp < timeEdge) {
            throw { code: 408, message: 'Identity timeout' };
        }

        if (!identityKey) {
            return;
        }

        if (this._cache.has(identityKey)) {
            throw { code: 409, message: 'IdentityKey duplicate' };
        }

        this._cache.add(identityKey);
        this._makeCleaner(identityKey);
    }

    _makeCleaner(identityKey) {
        // Do not use arrow function, possible memory leak
        setTimeout(this._cache.delete.bind(this._cache, identityKey), env.DS_IDENTITY_TTL);
    }
}

module.exports = Identity;
