const Disc = require('../models/discModel');

exports.updateDisc = (req, res) => {
    const discObject = req.body;
    const id = discObject._id;
    Disc.updateOne({ _id: id }, discObject)
        .then(() => res.status(200).json({ message: 'Disque modifié !',data:discObject}))
        .catch(error => res.status(400).json({ error }));
}