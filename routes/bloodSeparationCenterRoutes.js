const express = require('express');
const router = express.Router();

const bloodSeparationCenterController = require('../controllers/bloodSeparationCenterController');
const RoleNames = require('../constants/RoleNames');
const hasRoles = require('../middlewares/hasRoles');
const photoUpload = require('../middlewares/photoUpload');
const catchErrors = require('../middlewares/catchErrors');
const { requireJwtAuth } = require('../middlewares/passportAuth');

router.get('/',
  catchErrors(bloodSeparationCenterController.getBloodSeparationCenters)
);

router.get('/:id',
  catchErrors(bloodSeparationCenterController.getBloodSeparationCenter)
);

router.post('/',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodSeparationCenterController.createBloodSeparationCenter)
);

router.put('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodSeparationCenterController.updateBloodSeparationCenter)
);

router.delete('/:id',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodSeparationCenterController.deleteBloodSeparationCenter)
);

router.get('/:id/staffs',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodSeparationCenterController.getStaffsOfBloodSeparationCenter)
);

router.post('/:id/photos',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  photoUpload,
  catchErrors(bloodSeparationCenterController.uploadBloodSeparationCenterPhoto)
);

router.delete('/:id/photos/:photoId',
  requireJwtAuth,
  hasRoles([RoleNames.ADMIN]),
  catchErrors(bloodSeparationCenterController.deleteBloodSeparationCenterPhoto)
);

module.exports = router;
