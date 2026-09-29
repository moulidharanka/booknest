const admin = (req, res, next) => {
  // req.user is set by the protect middleware
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { admin };