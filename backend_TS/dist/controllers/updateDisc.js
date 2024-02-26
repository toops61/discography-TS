"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discModel_js_1 = __importDefault(require("../models/discModel.js"));
function updateDisc(req, res) {
    const discObject = req.body;
    const id = discObject._id;
    discModel_js_1.default.updateOne({ _id: id }, discObject)
        .then(() => res.status(200).json({ message: 'Disque modifié !', data: discObject }))
        .catch(() => res.status(400).json({ message: 'Erreur, le disque n\'a pu être modifié' }));
}
exports.default = updateDisc;
