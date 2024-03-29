const Joi = require('@hapi/joi');
const BloodTypes = require('../constants/BloodTypes');
const testResultSchema = require('./schemas/testResultSchema');
const separationResultSchema = require('./schemas/separationResultSchema');

exports.validateCreateBloodPack = (bloodPack) => {
  const schema = Joi.object().keys({
    donor: Joi.objectId().required(),
    volume: Joi.number().required()
  });

  return schema.validate(bloodPack);
};

exports.validateUpdateTestResults = (updateObject) => {
  const schema = Joi.object().keys({
    testResults: Joi.array().items(testResultSchema).unique('testType').required(),
    bloodType: Joi.string().required().valid([
      BloodTypes.A_POSITIVE,
      BloodTypes.A_NEGATIVE,
      BloodTypes.B_POSITIVE,
      BloodTypes.B_NEGATIVE,
      BloodTypes.O_POSITIVE,
      BloodTypes.O_NEGATIVE,
      BloodTypes.AB_POSITIVE,
      BloodTypes.AB_NEGATIVE
    ]),
    testDescription: Joi.string().required()
  });

  return schema.validate(updateObject);
};

exports.validateUpdateSeparationResults = (updateObject) => {
  const schema = Joi.object().keys({
    separationResults: Joi.array().items(separationResultSchema).required(),
    separationDescription: Joi.string().required()
  });

  return schema.validate(updateObject);
};
