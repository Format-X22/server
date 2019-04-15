const core = require('gls-core-service');
const MongoDB = core.services.MongoDB;

module.exports = MongoDB.makeModel('Node', {
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    links: {
        type: [String],
    },
    logo: {
        type: String,
    },
    knownNodes: {
        type: [String],
    },
});
