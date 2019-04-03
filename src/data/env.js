const env = process.env;

module.exports = {
    DS_MAX_HISTORY_LIMIT: Number(env.DS_MAX_HISTORY_LIMIT) || 100,
};
