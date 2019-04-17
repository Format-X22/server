const core = require('gls-core-service');
const Basic = core.controllers.Basic;
const NodeModel = require('../models/Node');
const HistoryUtil = require('../utils/History');

class Node extends Basic {
    async getInfo() {
        const model = await NodeModel.findOne(
            {},
            { __v: false, _id: false, createdAt: false, updatedAt: false },
            { lean: true }
        );

        model.name = model.name || 'Unknown';

        if (model) {
            return model;
        }

        return {
            name: 'Unknown',
        };
    }

    async setInfo({ name, description, links, logo }) {
        const model = await this._getModel();

        model.name = name || model.name;
        model.description = description || model.description;
        model.links = links || model.links;
        model.logo = logo || model.logo;

        await model.save();

        return await HistoryUtil.add('node', 'infoUpdated', {
            name,
            description,
            links,
            logo,
        });
    }

    async addKnownNodes({ knownNodes }) {
        const model = await this._getModel();
        const rawKnown = [...model.knownNodes, ...knownNodes];

        model.knownNodes = [...new Set(rawKnown)];

        await model.save();

        return await HistoryUtil.add('node', 'addKnownNodes', {
            knownNodes,
        });
    }

    async removeKnownNodes({ knownNodes }) {
        const model = await this._getModel();

        model.knownNodes = model.knownNodes.filter(node => !knownNodes.includes(node));

        await model.save();

        return await HistoryUtil.add('node', 'removeKnownNodes', {
            knownNodes,
        });
    }

    async _getModel() {
        let model = await NodeModel.findOne({});

        if (!model) {
            model = new NodeModel();
        }

        return model;
    }
}

module.exports = Node;
