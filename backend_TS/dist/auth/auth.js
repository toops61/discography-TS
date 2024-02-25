"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || (authorizationHeader === 'Bearer')) {
        const message = `vous devez vous connecter ou reconnecter`;
        return res.status(401).json({ message });
    }
    const token = authorizationHeader.split(' ')[1];
    if (!token) {
        const message = `vous devez vous connecter ou reconnecter`;
        return res.status(401).json({ message });
    }
    const importedToken = process.env.TOKEN_SECRET || '';
    jsonwebtoken_1.default.verify(token, importedToken, (error, decodedToken) => {
        if (error) {
            const message = `vous n'êtes pas autorisé à accèder à cette ressource`;
            return res.status(401).json({ message });
        }
        const userId = decodedToken && typeof decodedToken === 'object' ? decodedToken.userId : '';
        if (req.body.userId && req.body.userId !== userId) {
            const message = `votre identifiant est invalide`;
            res.status(401).json({ message });
        }
        else {
            next();
        }
    });
};
exports.default = auth;
