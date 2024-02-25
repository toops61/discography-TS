import DiscModel from '../models/discModel.js';

export default function updateDisc(req, res) {
    const discObject = req.body;
    const id = discObject._id;
    DiscModel.updateOne({ _id: id }, discObject)
        .then(() => res.status(200).json({ message: 'Disque modifié !',data:discObject}))
        .catch(() => res.status(400).json({ message: 'Erreur, le disque n\'a pu être modifié' }));
}