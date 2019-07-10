const bloodPackService = require('../services/bloodPackService');
const UrlUtils = require('../utils/UrlUtils');
const Pagination = require('../helpers/Pagination');
const { validateCreateBloodPack } = require('../validations/bloodPackValidations');

exports.getBloodPacks = async (req, res) => {
  const paginationObj = UrlUtils.createPaginationObject(req.query);
  const filterObj = UrlUtils.createBloodPackFilterObject(req.query);
  const sortObj = UrlUtils.createSortObject(req.query);

  const bloodPacks = await bloodPackService.getBloodPacks(paginationObj, filterObj, sortObj);
  const totalItems = await bloodPackService.countBloodPacks(filterObj);

  const data = {
    items: bloodPacks,
    pagination: new Pagination(paginationObj.page, paginationObj.size, totalItems)
  };

  return res.send(data);
};

exports.getBloodPack = async (req, res) => {
  const { id } = req.params;
  const bloodPack = await bloodPackService.getBloodPackById(id);

  if (!bloodPack) {
    return res.status(404).send();
  }

  return res.send(bloodPack);
};

exports.createBloodPack = async (req, res) => {
  const { error } = validateCreateBloodPack(req.body);
  if (error) {
    return res.status(400).send({ message: error.toString() });
  }

  const bloodCampId = req.user.bloodCamp;
  const bloodPack = await bloodPackService.createBloodPack({
    ...req.body,
    bloodCamp: bloodCampId,
    currentLocation: bloodCampId
  });

  return res.send(bloodPack);
};

exports.updateBloodPack = async (req, res) => {
  const { id } = req.params;
  const bloodPack = await bloodPackService.updateBloodPackById(id, req.body);

  if (!bloodPack) {
    return res.status(404).send();
  }

  return res.send(bloodPack);
};

exports.deleteBloodPack = async (req, res) => {
  const { id } = req.params;
  const bloodPack = await bloodPackService.deleteBloodPackById(id);

  if (!bloodPack) {
    return res.status(404).send();
  }

  return res.send(bloodPack);
};

exports.transferBloodPacksToBloodTestCenter = async (req, res) => {
  const bloodCampId = req.user.bloodCamp._id;
  const { bloodPackIds, bloodTestCenterId, description } = req.body;

  const results = await bloodPackService.transferBloodPacksToBloodTestCenter(
    bloodCampId,
    bloodPackIds,
    bloodTestCenterId,
    description
  );

  return res.send(results);
};