import DiscModel from '../models/discModel.js';
export default function deleteDisc(req, res) {
    const discObject = req.body;
    const id = discObject._id;
    DiscModel.findOne({ _id: id })
        .then(disc => {
        const albumName = (disc === null || disc === void 0 ? void 0 : disc.album) || '';
        DiscModel.deleteOne({ _id: id })
            .then(() => {
            const message = `Le disque ${albumName} a bien été supprimé`;
            res.status(200).json({ message, data: id });
        })
            .catch(() => res.status(400).json({ message: 'Le disque n\'existe pas ddans la base de données, vous ne pouvez le supprimer' }));
    })
        .catch(() => {
        const message = 'Le disque n\'a pas pu être récupéré, réessayez';
        res.status(500).json({ message });
    });
}
