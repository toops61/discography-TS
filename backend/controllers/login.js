import UserModel from '../models/userModel.js';
import {compare} from 'bcrypt';
import jwt from 'jsonwebtoken';

export default function connectUser(req, res) {
    UserModel.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json('l\'utilisateur n\'existe pas, inscrivez-vous svp');
            }

            compare(req.body.password, user.password).then(isPasswordValid => {
                if (!isPasswordValid) {
                    return res.status(401).json('erreur de mot de passe')
                }

                const token = jwt.sign(
                    { userId: user.id },
                    process.env.TOKEN_SECRET,
                    { expiresIn: '4h' }
                )

                const message = `L'utilisateur a été connecté avec succès`;
                return res.json({ message, data: user, token })

            })
        })
        .catch(error => {
            const message = `L'utilisateur n'a pas pu être connecté.`;
            return res.status(500).json({ message })
        })
}