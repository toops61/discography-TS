"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function connectUser(req, res) {
    const importedToken = process.env.TOKEN_SECRET || '';
    console.log(importedToken);
    userModel_1.default.findOne({ email: req.body.email })
        .then(user => {
        if (!user) {
            return res.status(401).json('l\'utilisateur n\'existe pas, inscrivez-vous svp');
        }
        (0, bcrypt_1.compare)(req.body.password, user.password).then(isPasswordValid => {
            if (!isPasswordValid) {
                return res.status(401).json('erreur de mot de passe');
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, importedToken, { expiresIn: '4h' });
            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token });
        });
    })
        .catch((error) => {
        const message = `L'utilisateur n'a pas pu être connecté.`;
        return res.status(500).json({ message });
    });
}
exports.default = connectUser;
