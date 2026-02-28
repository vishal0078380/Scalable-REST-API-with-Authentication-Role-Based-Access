const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            error: 'Access denied. Admin only.'
        });
    }
};


const canAccess = (resourceUserId) => {
    return (req, res, next) => {

        if (req.user.role === 'admin') {
            return next();
        }


        if (req.user.id === resourceUserId) {
            return next();
        }

        return res.status(403).json({
            success: false,
            error: 'Access denied. You can only access your own resources.'
        });
    };
};

const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized'
            });
        }

        if (roles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                error: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }
    };
};

module.exports = { admin, canAccess, hasRole };