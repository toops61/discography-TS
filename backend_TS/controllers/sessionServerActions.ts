import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SessionModel } from "../models/sessionModel.js";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthError, RefreshTokenPayload } from "../interfaces.js";
import { connectToDB } from "../auth/connectToDB.js";

export const addSession = async (userId: string, _req: Request, res: Response) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const sessionId = new mongoose.Types.ObjectId();

  const refreshToken = jwt.sign(
    { userId, sessionId: String(sessionId) },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );

  const accessToken = jwt.sign(
    { userId, sessionId: String(sessionId) },
    process.env.TOKEN_SECRET as string,
    { expiresIn: "15m" }
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await SessionModel.create({
    _id: sessionId,
    userId,
    refreshToken: hashedRefreshToken,
    expiresAt
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const checksSessionToken = async (req: Request) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AuthError("Token manquant", 401);
  }

  let decoded: RefreshTokenPayload;

  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as RefreshTokenPayload;
  } catch {
    throw new AuthError("Token invalide", 403);
  }

  const session = await SessionModel.findById(decoded.sessionId);

  if (!session) {
    throw new AuthError("Session introuvable", 404);
  }

  const match = await bcrypt.compare(refreshToken, session.refreshToken);

  if (!match) {
    throw new AuthError("Session invalide", 403);
  }

  return {
    userId: decoded.userId,
    sessionId: decoded.sessionId
  };
};

export const updateToken = async (req:Request,res:Response) => {
    try {
        const { userId } = await checksSessionToken(req);

        const newAccessToken = jwt.sign(
            { userId },
            process.env.TOKEN_SECRET as string,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, { 
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15*60*1000
         });
        
        res.json({ success: true });
    } catch {
        res.status(403).json({ success: false });
    }
}

const getUserFromRefresh = async (req: Request, res: Response) => {
  const { userId } = await checksSessionToken(req);

  const newAccessToken = jwt.sign(
    { userId },
    process.env.TOKEN_SECRET as string,
    { expiresIn: "15m" }
  );

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15*60*1000
  });

  return userId;
};

export const checksCookiesConnection = async (req: Request, res: Response) => {
  await connectToDB();

  const token = req.cookies.accessToken;

  try {
    if (token) {
        try {
            const { userId } = jwt.verify(
            token,
            process.env.TOKEN_SECRET as string
            ) as RefreshTokenPayload;

            return res.status(200).json({
            success: true,
            data: userId,
            message: "Vous êtes connecté"
            });

        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
            console.log('Token expired');      
            } else {
            return res.status(401).json({
                success: false,
                message: "Token invalide"
            });
            }
        }
    }

    const userId = await getUserFromRefresh(req,res);

    return res.status(200).json({
      success: true,
      data: userId,
      message: "Vous êtes connecté"
    });

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Non authentifié"
    });
  }
};

/* export const checksCookiesConnection = async (req:Request,res:Response) => {
    await connectToDB();
    
    const token = req.cookies.accessToken;

    if (!token) {
        try {
            const { userId } = await checksSessionToken(req);

            const newAccessToken = jwt.sign(
                { userId },
                process.env.TOKEN_SECRET as string,
                { expiresIn: "15m" }
            );

            res.cookie("accessToken", newAccessToken, { httpOnly: true });
            
            return res.status(200).json({
                success: true,
                data: userId,
                message: 'Vous êtes connecté'
            });
        } catch {
            res.status(403).json({ success: false,message:'Vous devez vous reconnecter' });
        }
    }

    try {
        const { userId } = jwt.verify(token,process.env.TOKEN_SECRET as string) as RefreshTokenPayload;
        if (!userId) return res.status(401).json({ success: false, message: "Vous n'êtes pas connecté" });

        return res.status(200).json({
            success: true,
            data: userId,
            message: 'Vous êtes connecté'
        });
    } catch (err) {
        const error = err as AuthError;

        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
} */