var sinon = require('sinon');
var assert = require('chai').assert;
var expect = require('chai').expect;
var userService = require('../../../modules/services/UserService');

var userHelper = require('../../../modules/utils/UserHelper');
var jWTHelper = require('../../../modules/utils/JWTHelper');

const ErrorCodes = require('../../../modules/commons/ErrorCodes');
const StockTickerError = require('../../../modules/commons/StockTickerError');

function userServiceTest() {
  
}

userServiceTest.prototype.test = function (){
        
        describe('Create User:', function (){
        it('Create user with user name and password', (done) => {
            var userRequest = {
                email: "john@gmail.com",
                password: "1234abcd"
              }
            sinon.stub(userHelper, 'createUser').withArgs(userRequest.email, userRequest.password).returns(Promise.resolve());
            userService.createUser(userRequest)
            .then((result) =>{
                done();
            }).finally(() => userHelper.createUser.restore());
        }),
        it('Create user with same user name', (done) => {
            var userRequest = {
                email: "john@gmail.com",
                password: "1234abcd"
              }
            sinon.stub(userHelper, 'createUser').withArgs(userRequest.email, userRequest.password).returns(Promise.reject(new StockTickerError(ErrorCodes.USER_ALREADY_EXIST.message, ErrorCodes.USER_ALREADY_EXIST)));
            userService.createUser(userRequest)
            .then((result) =>{
                
            },(rej)=>{
                expect(rej.errorCode).to.equal(ErrorCodes.USER_ALREADY_EXIST.errorCode);
                done();
            }).finally(() => userHelper.createUser.restore());
        });
    }),

    describe('Validate User:', function (){
        it('Validate user with user name and password', (done) => {
            var userRequest = {
                email: "john@gmail.com",
                password: "1234abcd"
              }
            var token="1234sfdfdfdsfdf"; 
            sinon.stub(userHelper, 'validateUser').withArgs(userRequest.email, userRequest.password).returns(Promise.resolve());
            sinon.stub(jWTHelper, 'createJWT').withArgs(userRequest.email).returns(token);
            userService.validateUser(userRequest)
            .then((result) =>{
                expect(result.accessToken).to.equal(token);
                done();
            }).finally(() => {
                userHelper.validateUser.restore();
                jWTHelper.createJWT.restore();
            });
        }),
        it('Validate user with wrong password', (done) => {
            var userRequest = {
                email: "john@gmail.com",
                password: "1234abcd"
              }
            sinon.stub(userHelper, 'validateUser').withArgs(userRequest.email, userRequest.password).returns(Promise.reject(new StockTickerError(ErrorCodes.INVALID_CREDS.message, ErrorCodes.INVALID_CREDS)));
            userService.validateUser(userRequest)
            .then((result) =>{
                
            },(rej)=>{
                expect(rej.errorCode).to.equal(ErrorCodes.INVALID_CREDS.errorCode);
                done();
            }).finally(() => userHelper.validateUser.restore());
        });
    });

}

module.exports = userServiceTest;