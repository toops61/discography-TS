const Disc = require('../models/discModel');

require('dotenv').config();

exports.createDisc = (req, res) => {
    const disc = req.body;
    delete disc._id;
    Disc.create({...disc})
        .then(disc => {
            const message = `Le disque est créé`
            res.json({
                message,
                data: disc
            })
        })
        .catch(error => {
            const message = 'Le disque n\'a pas pu être créé, réessayez dans un instant...'
            res.status(500).json({ message, data: error })
        })
}
