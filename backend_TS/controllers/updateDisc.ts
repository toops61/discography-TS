import { Request, Response } from 'express';
import DiscModel from '../models/discModel.js';

export default async function updateDisc(req: Request, res: Response) {
  try {
    const discObject = req.body;
    const id = discObject._id;

    const updatedDisc = await DiscModel.findByIdAndUpdate(
      id,
      discObject,
      { new: true }
    );

    if (!updatedDisc) {
      return res.status(404).json({
        success: false,
        message: "Disque introuvable"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Disque modifié !",
      data: updatedDisc
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Erreur, le disque n'a pu être modifié"
    });
  }
}