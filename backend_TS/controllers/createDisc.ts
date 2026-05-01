import { Request, Response } from 'express';
import DiscModel from '../models/discModel.js';

export default async function createDisc(req: Request, res: Response) {
  try {
    const disc = req.body;
    delete disc._id;

    const newDisc = await DiscModel.create({...disc});

    if (!newDisc) {
      return res.status(400).json({
        success: false,
        message: "Erreur lors de la création en base"
      });
    }

    return res.status(200).json({
      success: true,
      message: `Nouveau disque de ${newDisc.artist} ajouté`,
      data: newDisc
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Erreur, le disque n'a pas pu être créé"
    });
  }
}