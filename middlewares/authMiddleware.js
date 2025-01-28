import jpkg from 'jsonwebtoken';
const { verify } = jpkg;

const verifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({ message: "Access Denied" });
        }
        try{
            const decodedUser = verify(token, process.env.JWT_SECRET);
            req.user = decodedUser;
            next();
        } catch(err) {
            next(err);
        }
    } else {
        return res.status(401).json({ message: "No token, Access Denied" });
    }
}

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const isAllowed = allowedRoles.includes(req.user.role);
        if (!isAllowed) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    }
}

export { verifyToken , authorizeRoles };