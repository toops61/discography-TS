import DiscModel from '../models/discModel.js';
export default async function deleteDisc(req, res) {
    try {
        const discObject = req.body;
        const id = discObject._id;
        const discDeleted = await DiscModel.findByIdAndDelete(id);
        console.log('disc wanted Deleted :', discDeleted);
        if (!discDeleted) {
            return res.status(404).json({
                success: false,
                message: "Disque introuvable"
            });
        }
        return res.status(200).json({
            success: true,
            message: `Disque ${discDeleted.album} de ${discDeleted.artist} effacé ...`,
            data: id
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erreur, le disque n'a pas pu être effacé"
        });
    }
}
