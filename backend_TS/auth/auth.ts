import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { connectToDB } from './connectToDB.js';
import { AuthError, RefreshTokenPayload } from '../interfaces.js';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    await connectToDB();

    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ success: false, message: "reconnexion... plus d'access token" });
    }

    try {
        const { userId } = jwt.verify(token,process.env.TOKEN_SECRET as string) as RefreshTokenPayload;
        if (!userId) return res.status(401).json({ success: false, message: "" });
        next();
    } catch (err) {
        const error = err as AuthError;

        return res.status(401).json({
        success: false,
        message: error.message
        });
    }
};

export default auth;

/* const auth = (req:Request, res:Response, next:NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    
    if (!authorizationHeader || (authorizationHeader === 'Bearer')) {
        const message = `vous devez vous connecter ou reconnecter`;
        return res.status(401).json({ message });
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
        const message = `vous devez vous connecter ou reconnecter`;
        return res.status(401).json({message});
    }

    const importedToken = process.env.TOKEN_SECRET || '';

    jwt.verify(token, importedToken, (error, decodedToken) => {
        if (error) {
            const message = `vous n'êtes pas autorisé à accèder à cette ressource`;
            return res.status(401).json({ message });
        }

        const userId = decodedToken && typeof decodedToken === 'object' ? decodedToken.userId : '';
        if (req.body.userId && req.body.userId !== userId) {
            const message = `votre identifiant est invalide`;
            res.status(401).json({ message });
        } else {
            next();
        }
    })
} */

