const mongoose = require('mongoose');
const User = mongoose.model('User');


exports.getUserById = (id) => {
  const _id = mongoose.Types.ObjectId(id);
  return User.findById({ _id })
    .populate('roles')
    .exec();
};

exports.getUserByUsername = username => (
  User.findOne({ username })
    .populate('roles')
    .exec()
);

exports.createUser = (username, password, firstName, lastName) => {
  const newUser = new User({
    username,
    password,
    firstName,
    lastName
  });

  return newUser.save();
};
