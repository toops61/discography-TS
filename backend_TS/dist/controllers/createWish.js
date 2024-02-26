"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wishModel_js_1 = __importDefault(require("../models/wishModel.js"));
function createWish(req, res) {
    const disc = req.body;
    delete disc._id;
    wishModel_js_1.default.create(Object.assign({}, disc))
        .then(disc => {
        const message = `Le disque est créé`;
        res.json({
            message,
            data: disc
        });
    })
        .catch(error => {
        const message = 'Le disque n\'a pas pu être créé, réessayez...';
        res.status(500).json({ message: message + error.message });
    });
}
exports.default = createWish;
