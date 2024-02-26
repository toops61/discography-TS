"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wishModel_js_1 = __importDefault(require("../models/wishModel.js"));
function updateWish(req, res) {
    const discObject = req.body;
    const id = discObject._id;
    wishModel_js_1.default.updateOne({ _id: id }, discObject)
        .then(() => res.status(200).json({ message: 'Disque modifié !', data: discObject }))
        .catch(() => res.status(400).json({ message: 'le disque n\'a pu être modifé' }));
}
exports.default = updateWish;
