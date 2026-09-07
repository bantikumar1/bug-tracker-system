const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Authentication user role not found.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: '403 Forbidden. Access denied for your role.' });
    }

    next();
  };
};

module.exports = roleMiddleware;
