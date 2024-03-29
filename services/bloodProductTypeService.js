const mongoose = require('mongoose');
const BloodProductType = mongoose.model('BloodProductType');
const bloodProductService = require('./bloodProductService');

exports.getAllBloodProductTypes = () => BloodProductType.find().exec();

exports.getBloodProductTypes = (paginationObj, filterObj, sortObj) => (
  BloodProductType.aggregate([
    { $match: filterObj },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getBloodProductTypeById = id => (
  BloodProductType
    .findById(id)
    .exec()
);

exports.createBloodProductType = (bloodProductType) => {
  const newBloodProductType = new BloodProductType(bloodProductType);
  return newBloodProductType.save();
};

exports.updateBloodProductTypeById = (id, bloodProductType) => (
  BloodProductType
    .findByIdAndUpdate(id,
      { $set: bloodProductType },
      { new: true })
    .exec()
);

exports.deleteBloodProductTypeById = async id => {
  const bloodProductCount = await bloodProductService.countBloodProducts({
    'bloodProductType': mongoose.Types.ObjectId(id)
  });

  if (bloodProductCount > 0) {
    throw new Error('Blood product type is in use');
  }

  return BloodProductType
    .findByIdAndDelete(id)
    .exec()
};

exports.countBloodProductTypes = filterObj => (
  BloodProductType.find(filterObj)
    .countDocuments()
    .exec()
);
