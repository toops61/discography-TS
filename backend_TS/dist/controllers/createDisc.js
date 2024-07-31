import DiscModel from '../models/discModel.js';
export default function createDisc(req, res) {
    const disc = req.body;
    delete disc._id;
    DiscModel.create(Object.assign({}, disc))
        .then(disc => {
        const message = `Le disque est créé`;
        res.json({
            message,
            data: disc
        });
    })
        .catch(() => {
        const message = 'Le disque n\'a pas pu être créé, réessayez dans un instant...';
        res.status(500).json({ message });
    });
}
