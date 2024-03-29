const mongoose = require('mongoose');
const Reward = mongoose.model('Reward');
const photoService = require('./photoService');
const web3BloodChainService = require('./web3/web3BloodChainService');
const web3UserInfoService = require('./web3/web3UserInfoService');
const BloodChainUtils = require('../utils/BloodChainUtils');
const UpdatePointTypes = require('../constants/UpdatePointTypes');
const UpdatePointDescriptions = require('../constants/UpdatePointDescriptions');
const EthereumPlanNames = require('../constants/EthereumPlanNames');
const Web3Utils = require('../utils/Web3Utils');
const config = require('../config');

exports.getRewards = (paginationObj, filterObj, sortObj) => (
  Reward.aggregate([
    { $match: filterObj },
    {
      $lookup: {
        from: 'photos',
        localField: 'photos',
        foreignField: '_id',
        as: 'photos'
      }
    },
    {
      $addFields: {
        quantity: { $size: '$codes' }
      }
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        name: 1,
        point: 1,
        codes: 1,
        quantity: 1,
        description: 1,
        'photos._id': 1,
        'photos.url': 1,
        'photos.secureUrl': 1
      }
    },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getPublicRewards = (paginationObj, filterObj, sortObj) => (
  Reward.aggregate([
    { $match: filterObj },
    {
      $lookup: {
        from: 'photos',
        localField: 'photos',
        foreignField: '_id',
        as: 'photos'
      }
    },
    {
      $addFields: {
        quantity: { $size: '$codes' }
      }
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        name: 1,
        point: 1,
        quantity: 1,
        description: 1,
        'photos._id': 1,
        'photos.url': 1,
        'photos.secureUrl': 1
      }
    },
    { $sort: sortObj },
    { $skip: (paginationObj.page - 1) * paginationObj.size },
    { $limit: paginationObj.size }
  ])
);

exports.getRewardById = id => (
  Reward
    .findById(id)
    .populate('photos', '_id url secureUrl')
    .select('-codes')
    .exec()
);

exports.createReward = (reward) => {
  const newReward = new Reward(reward);
  return newReward.save();
};

exports.updateRewardById = (id, reward) => (
  Reward
    .findByIdAndUpdate(id,
      { $set: reward },
      { new: true })
    .exec()
);

exports.deleteRewardById = id => (
  Reward
    .findByIdAndDelete(id)
    .exec()
);

exports.countRewards = filterObj => (
  Reward.find(filterObj)
    .countDocuments()
    .exec()
);

exports.uploadRewardPhotoById = async (id, file) => {
  const photo = await photoService.uploadPhoto(file);
  return await Reward
    .findByIdAndUpdate(id,
      { $addToSet: { photos: photo._id } },
      { new: true })
    .exec()
};

exports.deleteRewardPhotoById = async (id, photoId) => {
  const photo = await photoService.deletePhotoById(photoId);
  if (!photo) {
    return null;
  }

  return await Reward
    .findByIdAndUpdate(id,
      { $pull: { photos: photoId } },
      { new: true })
    .exec()
};

exports.updateRewardCodesById = async (id, codesToAdd, codesToRemove) => {
  const reward = await Reward.findById(id);
  if (!reward) {
    return null;
  }

  let updatedReward;

  if (codesToRemove) {
    updatedReward = await Reward
      .findByIdAndUpdate(id,
        { $pull: { codes: { $in: codesToRemove } } },
        { new: true })
      .exec();
  }

  if (codesToAdd) {
    updatedReward = await Reward
      .findByIdAndUpdate(id,
        { $addToSet: { codes: { $each: codesToAdd } } },
        { new: true })
      .exec();
  }

  return updatedReward;
};

exports.redeemRewardById = async (id, userId) => {
  const reward = await Reward.findById(id);
  if (!reward || reward.codes.length <= 0) {
    return null;
  }

  const userInfoData = await web3BloodChainService.getUserInfo(userId);
  const userInfo = BloodChainUtils.extractUserInfo(userInfoData);

  if (!userInfo) {
    return null;
  }

  if (userInfo.point < reward.point) {
    return null;
  }

  const code = reward.codes[0];
  const userInfoAddress = await web3BloodChainService.getUserInfoAddress(userId.toString());
  await web3UserInfoService.updatePoint(
    userInfoAddress,
    UpdatePointTypes.SUBTRACT,
    reward.point,
    `${UpdatePointDescriptions.REDEEM_VOUCHER}|;|${id}|;|${reward.name}|;|${code}`
  );

  const updatedReward = await Reward
    .findByIdAndUpdate(id,
      { $pull: { codes: code } },
      { new: true })
    .exec();

  if (!updatedReward) {
    return null;
  }

  return code;
};

exports.getEthereumPlans = () => (
  Promise.resolve([
    {
      name: EthereumPlanNames.GOLD,
      eth: config.ethAmount.goldPlan,
      point: config.point.goldPlan
    },
    {
      name: EthereumPlanNames.SILVER,
      eth: config.ethAmount.silverPlan,
      point: config.point.silverPlan
    },
    {
      name: EthereumPlanNames.BRONZE,
      eth: config.ethAmount.bronzePlan,
      point: config.point.bronzePlan
    }
  ])
);

exports.redeemEthereum = async (userId, planName, address) => {
  const userInfoData = await web3BloodChainService.getUserInfo(userId);
  const userInfo = BloodChainUtils.extractUserInfo(userInfoData);

  if (!userInfo) {
    return null;
  }

  let point, amount;
  switch (planName) {
    case EthereumPlanNames.GOLD:
      point = config.point.goldPlan;
      amount = config.ethAmount.goldPlan;
      break;
    case EthereumPlanNames.SILVER:
      point = config.point.silverPlan;
      amount = config.ethAmount.silverPlan;
      break;
    case EthereumPlanNames.BRONZE:
      point = config.point.bronzePlan;
      amount = config.ethAmount.bronzePlan;
      break;
  }

  if (userInfo.point < point) {
    return null;
  }

  const amountInWei = Web3Utils.toWei(String(amount), 'ether');
  const transactionId = await web3BloodChainService.transfer(address, amountInWei);
  if (!transactionId) {
    return null;
  }

  const userInfoAddress = await web3BloodChainService.getUserInfoAddress(userId);

  // Due to Heroku timeout limit
  // await web3UserInfoService.updatePoint(
  web3UserInfoService.updatePoint(
    userInfoAddress,
    UpdatePointTypes.SUBTRACT,
    point,
    `${UpdatePointDescriptions.REDEEM_ETHEREUM}|;|${address}|;|${amount}|;|${transactionId}`
  );

  return transactionId;
};
