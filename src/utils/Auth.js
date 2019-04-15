const crypto = require('crypto');
const env = require('../data/env');

class Auth {
    verify(data) {
        // TODO -
        data.service.accountId = 'ID40806df7a8a2eaaffd363bafe5898731df37be4a73b4a6e2bd5964fe107cc607';

        return;

        const {
            service: { publicKey, sign },
        } = data;

        delete data.service.sign;

        const verified = this._verifyData(data, publicKey, sign);

        if (!verified) {
            throw { code: 403, message: 'Invalid signature' };
        }

        data.service.accountId = this._getAccountId(publicKey);
    }

    signResponse(data) {
        if (!data) {
            data = { status: 'OK' };
        }

        // TODO -
        data.sign = 'ok';

        return data;

        data.sign = this._signData(data, env.DS_ADMIN_PRIVATE_KEY);

        return data;
    }

    checkAdminAccess({ service: { publicKey } }) {
        // TODO -
        return;

        if (publicKey !== env.DS_ADMIN_PUBLIC_KEY) {
            throw { code: 403, message: 'Access denied' };
        }
    }

    _signData(data, privateKey) {
        const signer = crypto
            .createSign('sha256')
            .update(JSON.stringify(data))
            .end();

        return signer.sign(privateKey);
    }

    _verifyData(data, publicKey, sign) {
        const verifier = crypto
            .createVerify('sha256')
            .update(JSON.stringify(data))
            .end();

        return verifier.verify(publicKey, Buffer.from(sign, 'hex'));
    }

    _getAccountId(publicKey) {
        const accountHash = crypto
            .createHash('sha256')
            .update(publicKey)
            .digest('hex');

        return `ID${accountHash}`;
    }
}

module.exports = Auth;
