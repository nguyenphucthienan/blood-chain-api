const _ = require('lodash');
const mongoose = require('mongoose');

class UrlUtils {
  static createUserFilterObject(query) {
    const filters = _.omit(query, ['page', 'size', 'sort']);
    if (_.isEmpty(filters)) {
      return {};
    }

    const objectIdFields = ['_id'];
    const textFields = ['username', 'email', 'firstName', 'lastName'];
    const pointFields = ['location'];

    const filterObject = {};
    for (const key in filters) {
      if (objectIdFields.includes(key)) {
        filterObject[key] = mongoose.Types.ObjectId(filters[key]);
      } else if (textFields.includes(key)) {
        filterObject[key] = new RegExp(filters[key], 'i');
      } else if (pointFields.includes(key)) {
        filterObject[key] = UrlUtils.createLocationQuery(filters[key]);
      } else {
        filterObject[key] = filters[key];
      }
    }

    return filterObject;
  }

  static createBloodCampFilterObject(query) {
    const filters = _.omit(query, ['page', 'size', 'sort']);
    if (_.isEmpty(filters)) {
      return {};
    }

    const objectIdFields = ['_id'];
    const textFields = ['name', 'address', 'email', 'phone'];
    const pointFields = ['location'];

    const filterObject = {};
    for (const key in filters) {
      if (objectIdFields.includes(key)) {
        filterObject[key] = mongoose.Types.ObjectId(filters[key]);
      } else if (textFields.includes(key)) {
        filterObject[key] = new RegExp(filters[key], 'i');
      } else if (pointFields.includes(key)) {
        filterObject[key] = UrlUtils.createLocationQuery(filters[key]);
      } else {
        filterObject[key] = filters[key];
      }
    }

    return filterObject;
  }

  static createBloodTestCenterFilterObject(query) {
    const filters = _.omit(query, ['page', 'size', 'sort']);
    if (_.isEmpty(filters)) {
      return {};
    }

    const objectIdFields = ['_id'];
    const textFields = ['name', 'address', 'email', 'phone'];
    const pointFields = ['location'];

    const filterObject = {};
    for (const key in filters) {
      if (objectIdFields.includes(key)) {
        filterObject[key] = mongoose.Types.ObjectId(filters[key]);
      } else if (textFields.includes(key)) {
        filterObject[key] = new RegExp(filters[key], 'i');
      } else if (pointFields.includes(key)) {
        filterObject[key] = UrlUtils.createLocationQuery(filters[key]);
      } else {
        filterObject[key] = filters[key];
      }
    }

    return filterObject;
  }

  static createBloodSeparationCenterFilterObject(query) {
    const filters = _.omit(query, ['page', 'size', 'sort']);
    if (_.isEmpty(filters)) {
      return {};
    }

    const objectIdFields = ['_id'];
    const textFields = ['name', 'address', 'email', 'phone'];
    const pointFields = ['location'];

    const filterObject = {};
    for (const key in filters) {
      if (objectIdFields.includes(key)) {
        filterObject[key] = mongoose.Types.ObjectId(filters[key]);
      } else if (textFields.includes(key)) {
        filterObject[key] = new RegExp(filters[key], 'i');
      } else if (pointFields.includes(key)) {
        filterObject[key] = UrlUtils.createLocationQuery(filters[key]);
      } else {
        filterObject[key] = filters[key];
      }
    }

    return filterObject;
  }

  static createBloodBankFilterObject(query) {
    const filters = _.omit(query, ['page', 'size', 'sort']);
    if (_.isEmpty(filters)) {
      return {};
    }

    const objectIdFields = ['_id'];
    const textFields = ['name', 'address', 'email', 'phone'];
    const pointFields = ['location'];

    const filterObject = {};
    for (const key in filters) {
      if (objectIdFields.includes(key)) {
        filterObject[key] = mongoose.Types.ObjectId(filters[key]);
      } else if (textFields.includes(key)) {
        filterObject[key] = new RegExp(filters[key], 'i');
      } else if (pointFields.includes(key)) {
        filterObject[key] = UrlUtils.createLocationQuery(filters[key]);
      } else {
        filterObject[key] = filters[key];
      }
    }

    return filterObject;
  }

  static createHospitalFilterObject(query) {
    const filters = _.omit(query, ['page', 'size', 'sort']);
    if (_.isEmpty(filters)) {
      return {};
    }

    const objectIdFields = ['_id'];
    const textFields = ['name', 'address', 'email', 'phone'];
    const pointFields = ['location'];

    const filterObject = {};
    for (const key in filters) {
      if (objectIdFields.includes(key)) {
        filterObject[key] = mongoose.Types.ObjectId(filters[key]);
      } else if (textFields.includes(key)) {
        filterObject[key] = new RegExp(filters[key], 'i');
      } else if (pointFields.includes(key)) {
        filterObject[key] = UrlUtils.createLocationQuery(filters[key]);
      } else {
        filterObject[key] = filters[key];
      }
    }

    return filterObject;
  }

  static createCampaignFilterObject(query) {
    const filters = _.omit(query, ['page', 'size', 'sort']);
    if (_.isEmpty(filters)) {
      return {};
    }

    const objectIdFields = ['_id', 'bloodCamp._id'];
    const textFields = ['name', 'description'];
    const pointFields = ['bloodCamp.location'];

    const filterObject = {};
    for (const key in filters) {
      if (objectIdFields.includes(key)) {
        filterObject[key] = mongoose.Types.ObjectId(filters[key]);
      } else if (textFields.includes(key)) {
        filterObject[key] = new RegExp(filters[key], 'i');
      } else if (pointFields.includes(key)) {
        filterObject[key] = UrlUtils.createLocationQuery(filters[key]);
      } else if (key === 'fromDate') {
        filterObject['startDate'] = { $gte: new Date(filters[key]) };
      } else if (key === 'toDate') {
        filterObject['endDate'] = { $lte: new Date(filters[key]) };
      } else {
        filterObject[key] = filters[key];
      }
    }

    return filterObject;
  }

  static createBloodPackFilterObject(query) {
    const filters = _.omit(query, ['page', 'size', 'sort', 'organization']);
    if (_.isEmpty(filters)) {
      return {};
    }

    const objectIdFields = [
      '_id',
      'donor',
      'bloodCamp',
      'bloodTestCenter',
      'bloodSeparationCenter',
      'currentLocation'
    ];

    const filterObject = {};
    for (const key in filters) {
      if (objectIdFields.includes(key)) {
        filterObject[key] = mongoose.Types.ObjectId(filters[key]);
      } else {
        filterObject[key] = filters[key];
      }
    }

    return filterObject;
  }

  static createBloodProductFilterObject(query) {
    const filters = _.omit(query, ['page', 'size', 'sort', 'organization']);
    if (_.isEmpty(filters)) {
      return {};
    }

    const objectIdFields = [
      '_id',
      'donor',
      'bloodPack',
      'bloodSeparationCenter',
      'currentLocation'
    ];

    const filterObject = {};
    for (const key in filters) {
      if (objectIdFields.includes(key)) {
        filterObject[key] = mongoose.Types.ObjectId(filters[key]);
      } else {
        filterObject[key] = filters[key];
      }
    }

    return filterObject;
  }

  static createFilterObject(query) {
    const filters = _.omit(query, ['page', 'size', 'sort']);
    if (_.isEmpty(filters)) {
      return {};
    }

    const objectIdFields = ['_id'];
    const textFields = ['name'];
 
    const filterObject = {};
    for (const key in filters) {
      if (objectIdFields.includes(key)) {
        filterObject[key] = mongoose.Types.ObjectId(filters[key]);
      } else if (textFields.includes(key)) {
        filterObject[key] = new RegExp(filters[key], 'i');
      } else {
        filterObject[key] = filters[key];
      }
    }

    return filterObject;
  }

  static createLocationQuery(locationString, radiusInKm = 10) {
    const data = locationString.split(',');
    const lng = parseFloat(data[0]);
    const lat = parseFloat(data[1]);
    return {
      $geoWithin: {
        $centerSphere: [
          [lng, lat],
          radiusInKm / 6378.1
        ]
      }
    };
  }

  static createPaginationObject(query, defaultPageNumber = 1, defaultPageSize = 10) {
    const page = Math.max(1, parseInt(query.page, 10)) || defaultPageNumber;
    const size = parseInt(query.size, 10) || defaultPageSize;
    return { page, size };
  }

  static createSortObject(query) {
    const { sort } = query;
    if (!sort) {
      return { createdAt: -1 };
    }

    return sort.split(',')
      .reduce((sortObj, item) => {
        const key = item.substr(1);
        const value = item.charAt(0) === '-' ? -1 : 1;
        const newSortObj = { ...sortObj };
        newSortObj[key] = value;
        return newSortObj;
      }, {});
  }
}

module.exports = UrlUtils;
