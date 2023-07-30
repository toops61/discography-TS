const Wish = require('../models/wishModel');

exports.updateWish = (req, res) => {
    const discObject = req.body;
    const id = discObject._id;
    Wish.updateOne({ _id: id }, discObject)
        .then(() => res.status(200).json({ message: 'Disque modifié !',data:discObject }))
        .catch(error => res.status(400).json({ error }));
}