'use strict'; // NOSONAR

const StockTickerServiceTest = require('./modules/services/StockTickerServiceTest');
const UserServiceTest = require('./modules/services/UserServiceTest');


const stockTickerServiceTest = new StockTickerServiceTest();
const userServiceTest = new UserServiceTest();

describe('## API Tests', () => {
    stockTickerServiceTest.test();
    userServiceTest.test();
});
