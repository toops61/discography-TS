"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wishModel_js_1 = __importDefault(require("../models/wishModel.js"));
function deleteWish(req, res) {
    const discObject = req.body;
    const id = discObject._id;
    wishModel_js_1.default.findOne({ _id: id })
        .then(_disc => {
        wishModel_js_1.default.deleteOne({ _id: id })
            .then(() => {
            const message = `Le disque a bien été supprimé`;
            res.status(200).json({ message, data: id });
        })
            .catch(() => res.status(400).json({ message: 'le disque n\'a pas pu être supprimé' }));
    })
        .catch(error => {
        const message = 'Le disque n\'a pas pu être récupéré :-( Réessayez dans quelques instants.';
        res.status(500).json({ message, data: error });
    });
}
exports.default = deleteWish;
