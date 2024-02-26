"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discModel_js_1 = __importDefault(require("../models/discModel.js"));
function createDisc(req, res) {
    const disc = req.body;
    delete disc._id;
    discModel_js_1.default.create(Object.assign({}, disc))
        .then(disc => {
        const message = `Le disque est créé`;
        res.json({
            message,
            data: disc
        });
    })
        .catch(() => {
        const message = 'Le disque n\'a pas pu être créé, réessayez dans un instant...';
        res.status(500).json({ message });
    });
}
exports.default = createDisc;
