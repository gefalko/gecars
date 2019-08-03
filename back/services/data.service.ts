require('./../models/db');

import {Provider} from './../models/provider/ProviderModel'
import {Make} from './../models/make/MakeModel'
import {ModelType} from './../models/modelType/ModelTypeModel'
import {Order} from './../models/order/OrderModel'
import {FuelType} from './../models/fuelType/FuelTypeModel'
import {Transaction} from './../models/transaction/TransactionModel'
import {Ad} from './../models/ad/AdModel'
import {User} from './../models/user/UserModel'
import {Filter} from './../models/filter/FilterModel'

module.exports = {
  findMake: findMake,
  findMakeId: findMakeId,
  findModelId: findModelId,
  findModel: findModel,
  findUser: findUser,
  getUsers: getUsers,

  findFilters: findFilters,
  updateFilter: updateFilter,
  getFilterById: getFilterById,
  getFilterByIdFull: getFilterByIdFull,
  removeFilter: removeFilter,
  createFilter: createFilter,

  loadAllMakesFull: loadAllMakesFull,
  findOrderById: findOrderById,
  findProviderId: findProviderId,
  getProviders: getProviders,
  getProvider: getProvider,
  getFuelTypes: getFuelTypes,
  updateProvider: updateProvider,
  updateFuelType: updateFuelType,
  createOrder: createOrder,
  createTransaction: createTransaction,
  createMake: createMake,
  findUserOrders: findUserOrders,
  findModelsByName: findModelsByName,
  saveUser: saveUser,

  /* Ads */

  orAdExist: orAdExist
}

function saveUser(email, pass) {

  console.log("SAVE NEW USER", email);

  const user = new User();

  user.email = email;

  user.setPassword(pass);

  return new Promise(function (resolve) {

    user.save(function (err) {
      const token = user.generateJwt();
      resolve(token);
    });
  })

}

function findUser(email) {
  return new Promise(function (resolve) {
    User.findOne({email: email}, function (err, user) {
      if (err)throw err;
      resolve(user);
    })
  })
}

function getUsers() {
  return new Promise(function (resolve) {
    User.find({}, function (err, users) {
      if (err)throw err;
      resolve(users);
    })
  })
}

function findMake(make) {
  return new Promise(function (resolve) {
    Make.findOne({make: make}, function (err, make) {
      if (err)throw err;
      resolve(make);
    })
  })
}

function findMakeId(make) {
  return new Promise(function (resolve) {
    findMake(make).then(function (make) {
      if (!make) resolve(make);
      resolve(make._id);
    })
  })
}

function findModelsByName(modelName) {
  return new Promise(function (resolve) {
    ModelType.find({name: modelType}, function (err, models) {
      if (err)throw err;
      else resolve(models);
    })
  })
}

function findModel(makeId, modelType) {
  return new Promise(function (resolve) {
    ModelType.findOne({name: modelType, make: makeId}, function (err, make) {
      if (err)throw err;
      else resolve(make);
    })
  })
}

function findModelId(makeId, modelType) {
  return new Promise(function (resolve) {
    console.log('findModelId makeId:');
    console.log('makeId:', makeId);
    console.log('modelType:', modelType);

    findModel(makeId, modelType).then(function (modelType) {

      console.log("RES", modelType);

      if (!modelType) resolve(modelType);
      resolve(modelType._id);
    })
  })
}

// filters

function findFilters(query) {
  return new Promise(function (resolve) {
    Filter.find(query, function (err, filters) {
      if (err)throw err;
      resolve(filters);
    })
  })
}

function updateFilter(filterId, newFilter) {
  return new Promise(function (resolve) {
    Filter.findOneAndUpdate({_id: filterId}, newFilter, {upsert: true}, function (err, filter) {
      if (err)throw err;
      resolve(filter);
    });
  })
}

function getFilterById(id) {
  return new Promise(function (resolve) {
    Filter.findById(id, function (err, filter) {
      if (err)throw err;
      resolve(filter);
    });
  });

}

function getFilterByIdFull(id) {
  return new Promise(function (resolve) {
    Filter.findById(id).populate([
      {path: 'make'},
      {path: 'modelType'}
    ]).exec().then(function (filter) {
      resolve(filter);
    });
  });

}

function updateProvider(name, newProvider) {
  return new Promise(function (resolve) {
    Provider.findOneAndUpdate({name: name}, newProvider, {upsert: true}, function (err, provider) {
      if (err)throw err;
      resolve(provider);
    });
  })
}

function updateFuelType(name, newFuelType) {
  return new Promise(function (resolve) {
    FuelType.findOneAndUpdate({name: name}, newFuelType, {upsert: true}, function (err, fuelType) {
      if (err)throw err;
      resolve(fuelType);
    });
  });
}

function findProviderId(provider) {
  return new Promise(function (resolve) {
    Provider.findOne({name: provider}, function (err, provider) {
      if (err)throw err;
      resolve(provider ? provider._id : null);
    })
  })
}

function getProviders() {
  return new Promise(function (resolve) {
    Provider.find({}, function (err, providers) {
      if (err)throw err;
      resolve(providers);
    });
  });
}

function getProvider(id) {
  return new Promise(function (resolve) {
    Provider.findById(id, function (err, provider) {
      if (err)throw err;
      resolve(provider);
    });
  });
}

function getFuelTypes() {
  return new Promise(function (resolve) {
    FuelType.find({}, function (err, fuelTypes) {
      if (err)throw err;
      resolve(fuelTypes);
    });
  });
};

function loadAllMakesFull() {
  return new Promise(function (resolve) {
    Make.find({})
        .populate([{path: 'modelsTypes'}])
        .exec().then(function (makes) {
      resolve(makes);
    })
  })
}

function createFilter(filter) {
  return new Promise(function (resolve) {
    Filter.create(filter, function (err, filter) {
      if (err) {
        throw err;
      }
      resolve(filter)
    })
  })
}

function removeFilter(filterId) {
  return new Promise(function (resolve) {
    Filter.remove({_id: filterId}, function (err) {
      if (!err) {
        resolve(true);
      }
    })
  });
}

function findOrderById(orderId) {
  return new Promise(function (resolve) {
    Order.findById(orderId, function (err, order) {
      if (err)throw err;
      resolve(order);
    })
  })
}

function findUserOrders(userId) {
  return new Promise(function (resolve) {
    Order.find({user: userId})
        .populate([
          {
            path: 'filters',
            populate: [
              {path: 'modelType'},
              {path: 'make'},
              {path: 'fuel2'},
              {path: 'providers'}
            ]
          }])
        .exec().then(function (orders) {
      resolve(orders);
    })
  })
}

function createOrder(order) {
  return new Promise(function (resolve) {
    Order.create(order, function (err, order) {
      if (err)throw err;
      resolve(order);
    })
  })
}

function createMake(make) {
  return new Promise(function (resolve) {
    Make.create(make, function (err, make) {
      if (err)throw err;
      resolve(make);
    })
  })
}

function createTransaction(transaction) {
  return new Promise(function (resolve) {
    Transaction.create(Transaction, function (err, transaction) {
      if (err)throw err;
      resolve(transaction);
    })
  });
}

/* Ads */

function orAdExist(ad) {
  return new Promise(function (resolve) {
    Ad.findOne({filter: ad.filter, providerAdId: ad.providerAdId}, function (err, ad) {
      resolve(ad !== null);
    })
  });
}
