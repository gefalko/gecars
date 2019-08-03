import { collect } from '../../services/collector.service'
import {User} from '../../models/user/UserModel'

const mongoose = require('mongoose');
require('../../models/db');

const provider = 'autotrader' // 'autotrader', 'ebay

const filter = {
  make: {
    make: 'nissan',
  },
  modelType: {
    providersData: {},
    name: 'x-trail'
  },
  fuel: 'petrol',
  priceFrom: 0,
  priceTo: 3000,
  yearFrom: 1990,
  yearTo: 2020,
  providers: ['gumtree', 'ebay', 'autotrader'],
}

const start = async () => {

  // Loading users allow ensure that db is ready.

  const users = await User.find({}).populate({
    path:'orders',
    populate:[{
        path:'filters',
        model:'Filter',
        populate:[{path:'providers'},{path:'make',modelType:'Make'},{path:'modelType', modelType:'modelType'},]
    },{path:'user',model:'User'}]
  })

  console.log('Users:', users)

  await collect(provider, filter)
}


start()
