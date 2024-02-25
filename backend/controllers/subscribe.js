import UserModel from '../models/userModel.js';
import {hash} from 'bcrypt';
import jwt from 'jsonwebtoken';

export default function createUser(req, res) {
    const utilisateur = req.body;
    hash(utilisateur.password, 10, (err, hash) => {
        utilisateur.password = hash;
        const profil = {...utilisateur};
        UserModel.create(profil)
            .then(user => {
                const message = `Votre profil est créé, ${profil.email}. Bienvenue !`
                res.json({
                    message, 
                    data: user, 
                    token: jwt.sign(
                        { userId: user.id },
                        process.env.TOKEN_SECRET,
                        { expiresIn: '4h' }
                    )
                })
            })
            .catch(error => {
                let message = 'L\'utilisateur n\'a pas pu être créé, réésayez dans un instant...'
                res.status(500).json({ message, data: error })
            })
    })
}