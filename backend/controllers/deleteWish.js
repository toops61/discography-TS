const Wish = require('../models/wishModel');

exports.deleteWish = (req, res) => {
    const discObject = req.body;
    const id = discObject._id;
    Wish.findOne({ _id: id})
        .then(disc => {
            Wish.deleteOne({ _id: id })
            .then(() => {
                const message = `Le disque a bien été supprimé`
                res.status(200).json({ message, data:id })
            })
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => {
            const message = 'Le disque n\'a pas pu être récupéré :-( Réessayez dans quelques instants.'
            res.status(500).json({ message, data: error })
        });        
}