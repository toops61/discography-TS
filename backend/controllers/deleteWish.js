const Wish = require('../models/wishModel');

exports.deleteWish = (req, res) => {
    const discObject = req.body;
    const id = discObject._id;
    Wish.findOne({ _id: id})
        .then(_disc => {
            Wish.deleteOne({ _id: id })
            .then(() => {
                const message = `Le disque a bien été supprimé`
                res.status(200).json({ message, data:id })
            })
            .catch(() => res.status(400).json({ message: 'le disque n\'a pas pu être supprimé' }));
        })
        .catch(error => {
            const message = 'Le disque n\'a pas pu être récupéré :-( Réessayez dans quelques instants.'
            res.status(500).json({ message, data: error })
        });        
}