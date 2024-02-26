import { Request, Response } from 'express';
import WishModel from '../models/wishModel.js';

export default function createWish(req:Request, res:Response) {
    const disc = req.body;
    delete disc._id;
    WishModel.create({...disc})
        .then(disc => {
            const message = `Le disque est créé`;
            res.json({
                message,
                data: disc
            });
        })
        .catch(error => {
            const message = 'Le disque n\'a pas pu être créé, réessayez...';
            res.status(500).json({ message:message+error.message});
        })
}
