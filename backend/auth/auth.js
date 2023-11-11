const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    
    if (!authorizationHeader || (authorizationHeader === 'Bearer')) {
        const message = `vous devez vous connecter ou reconnecter`;
        return res.status(401).json({ message });
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
        const message = `vous devez vous connecter ou reconnecter`;
        return res.status(401).json({message});
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (error, decodedToken) => {
        if (error) {
            const message = `vous n'êtes pas autorisé à accèder à cette ressource`;
            return res.status(401).json({ message });
        }

        const userId = decodedToken.userId
        if (req.body.userId && req.body.userId !== userId) {
            const message = `votre identifiant est invalide`;
            res.status(401).json({ message });
        } else {
            next();
        }
    })
}