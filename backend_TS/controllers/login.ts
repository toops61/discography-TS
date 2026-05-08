import { Request, Response } from 'express';
import UserModel from '../models/userModel.js';
import {compare} from 'bcrypt';
import { connectToDB } from '../auth/connectToDB.js';
import { addSession, checksSessionToken } from './sessionServerActions.js';
import { SessionModel } from '../models/sessionModel.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/* export default async function connectUser(req:Request, res:Response) {
    const importedToken = process.env.TOKEN_SECRET || '';
    
    const responseFunc = async (user:userModelType) => {
        const match = await compare(req.body.password, user.password);
        if (match) {
            const token = jwt.sign(
                { userId: user.id },
                importedToken,
                { expiresIn: '4h' }
            )
            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token })
        } else {
            return res.status(401).json('Erreur de mot de passe');
        }
    }

    try {
        const queryUser = await UserModel.findOne({ login: req.body.login });
        if (queryUser) {
            responseFunc(queryUser);
        } else {
            return res.status(401).json('L\'utilisateur n\'existe pas, inscrivez-vous svp');
        }
    } catch (error) {
        const message = `L'utilisateur n'a pas pu être connecté.`;
        return res.status(500).json({ message, data: error })
    }
} */

export default async function connectUser(req:Request, res:Response) {
  try {    
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ success: false });
    }

    await connectToDB();

    const userFound = await UserModel.findOne({ login });

    if (!userFound) {
      return res.json({ success: false, message: "Utilisateur inexistant, créez un compte" });
    }

    const isLogged = await compare(password, userFound.password);

    if (!isLogged) {
      return res.json({ success: false, message: "Erreur de mot de passe" });
    }

    await addSession(String(userFound._id), req, res);

    return res.json({
      success: true,
      message: `Vous êtes connecté, ${login}`,
      data: {login,userId:userFound._id}
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
}

export const disconnectUser = async (req:Request,res:Response) => {
    await connectToDB();

    const { sessionId } = await checksSessionToken(req);

    await SessionModel.findByIdAndDelete(sessionId);

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });

    return res.json({
        success: true,
        message: `Vous êtes déconnecté`
    });
}