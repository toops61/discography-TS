import UserModel from '../models/userModel.js';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
export default function createUser(req, res) {
    const importedToken = process.env.TOKEN_SECRET || '';
    const utilisateur = req.body;
    hash(utilisateur.password, 10, (err, hash) => {
        utilisateur.password = hash;
        const profil = Object.assign({}, utilisateur);
        UserModel.create(profil)
            .then(user => {
            const message = `Votre profil est créé, ${profil.email}. Bienvenue !`;
            res.json({
                message,
                data: user,
                token: jwt.sign({ userId: user.id }, importedToken, { expiresIn: '4h' })
            });
        })
            .catch((error) => {
            let message = 'L\'utilisateur n\'a pas pu être créé, réésayez dans un instant...';
            res.status(500).json({ message, data: error });
        });
    });
}
