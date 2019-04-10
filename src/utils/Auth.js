const crypto = require('crypto');
const env = require('../data/env');

class Auth {
    verify(data) {
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

        data.sign = this._signData(data, env.DS_ADMIN_PRIVATE_KEY);

        return data;
    }

    checkAdminAccess({ service: { publicKey } }) {
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
