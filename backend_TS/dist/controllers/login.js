import UserModel from '../models/userModel.js';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
export default async function connectUser(req, res) {
    const importedToken = process.env.TOKEN_SECRET || '';
    const responseFunc = async (user) => {
        const match = await compare(req.body.password, user.password);
        if (match) {
            const token = jwt.sign({ userId: user.id }, importedToken, { expiresIn: '4h' });
            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token });
        }
        else {
            return res.status(401).json('Erreur de mot de passe');
        }
    };
    try {
        const queryUser = await UserModel.findOne({ email: req.body.email });
        if (queryUser) {
            responseFunc(queryUser);
        }
        else {
            return res.status(401).json('L\'utilisateur n\'existe pas, inscrivez-vous svp');
        }
    }
    catch (error) {
        const message = `L'utilisateur n'a pas pu être connecté.`;
        return res.status(500).json({ message, data: error });
    }
}
