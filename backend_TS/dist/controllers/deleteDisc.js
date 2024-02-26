"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discModel_js_1 = __importDefault(require("../models/discModel.js"));
function deleteDisc(req, res) {
    const discObject = req.body;
    const id = discObject._id;
    discModel_js_1.default.findOne({ _id: id })
        .then(disc => {
        const albumName = (disc === null || disc === void 0 ? void 0 : disc.album) || '';
        discModel_js_1.default.deleteOne({ _id: id })
            .then(() => {
            const message = `Le disque ${albumName} a bien été supprimé`;
            res.status(200).json({ message, data: id });
        })
            .catch(() => res.status(400).json({ message: 'Le disque n\'existe pas ddans la base de données, vous ne pouvez le supprimer' }));
    })
        .catch(() => {
        const message = 'Le disque n\'a pas pu être récupéré, réessayez';
        res.status(500).json({ message });
    });
}
exports.default = deleteDisc;
