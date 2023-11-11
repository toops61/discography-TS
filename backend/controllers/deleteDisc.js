const Disc = require('../models/discModel');

exports.deleteDisc = (req, res) => {
    const discObject = req.body;
    const id = discObject._id;
    Disc.findOne({ _id: id})
        .then(disc => {
            Disc.deleteOne({ _id: id })
            .then(() => {
                const message = `Le disque ${disc.album} a bien été supprimé`;
                res.status(200).json({ message,data:id });
            })
            .catch(() => res.status(400).json({ message: 'Le disque n\'existe pas ddans la base de données, vous ne pouvez le supprimer' }));
        })
        .catch(() => {
            const message = 'Le disque n\'a pas pu être récupéré, réessayez';
            res.status(500).json({ message });
        });        
}