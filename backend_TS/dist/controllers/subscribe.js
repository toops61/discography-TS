"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createUser(req, res) {
    const importedToken = process.env.TOKEN_SECRET || '';
    const utilisateur = req.body;
    (0, bcrypt_1.hash)(utilisateur.password, 10, (err, hash) => {
        utilisateur.password = hash;
        const profil = Object.assign({}, utilisateur);
        userModel_1.default.create(profil)
            .then(user => {
            const message = `Votre profil est créé, ${profil.email}. Bienvenue !`;
            res.json({
                message,
                data: user,
                token: jsonwebtoken_1.default.sign({ userId: user.id }, importedToken, { expiresIn: '4h' })
            });
        })
            .catch((error) => {
            let message = 'L\'utilisateur n\'a pas pu être créé, réésayez dans un instant...';
            res.status(500).json({ message, data: error });
        });
    });
}
exports.default = createUser;
