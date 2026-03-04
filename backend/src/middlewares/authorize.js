const authorize = (allowedRoles) => {
    return(req, res, next) => {

        const userRole = req.user.role 

        if(!allowedRoles.includes(userRole)){
            return res.status(403).json({ error: "Acess Denied"})
        }

        next()
    }
}

module.exports = authorize