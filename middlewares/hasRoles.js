module.exports = allowedRoles => (req, res, next) => {
  let isAuthorized = false;

  req.user.roles.forEach((role) => {
    if (allowedRoles.includes(role.name)) {
      isAuthorized = true;
      return;
    }
  });

  if (!isAuthorized) {
    return res.status(403).send({ message: 'You do not have permission to do this' });
  }

  return next();
};
