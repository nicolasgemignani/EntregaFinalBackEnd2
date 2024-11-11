export const authorization = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ error: 'User not authenticated' })
        }

        // Verificar si el rol del usuario está dentro de los roles permitidos
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ error: 'Forbidden: You do not have the required role' })
        }

        next()
    };
};
