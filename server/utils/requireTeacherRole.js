// not used

const requireTeacherRole = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Access denied. Teachers only." });
  }
  next();
};

module.exports = {
  requireTeacherRole,
};
