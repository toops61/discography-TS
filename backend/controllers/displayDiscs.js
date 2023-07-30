const Disc = require('../models/discModel')

exports.displayDiscs = (req, res) => {

    Disc.find()
        .then(discs => res.status(200).json(discs))
        .catch(error => {
            const message = `Les disques n'ont pas été chargés.`;
            return res.status(401).json({ message, data: error })
        })
}