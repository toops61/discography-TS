import WishModel from '../models/wishModel.js';

export default function updateWish(req, res) {
    const discObject = req.body;
    const id = discObject._id;
    WishModel.updateOne({ _id: id }, discObject)
        .then(() => res.status(200).json({ message: 'Disque modifié !',data:discObject }))
        .catch(() => res.status(400).json({ message : 'le disque n\'a pu être modifé' }));
}