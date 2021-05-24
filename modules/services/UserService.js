/**
 *Service layer responsible for:
 1. Infra layer communication
 2. Dao layer communication
 3. Validate and Aggregats the result coming from different layers
 4. Convert the result as per openAPI format
 
 * @author Manoj Jain
 * @since 1.0
 * @version 1.0
 */
var userHelper = require('../utils/UserHelper');
var jWTHelper = require('../utils/JWTHelper');

module.exports = {

    createUser:(request) => new Promise((resolve, reject) => {

        userHelper.createUser(request.email, request.password).then(()=>{
            resolve();
        },(rej) => {
           reject(rej);
        });
    }),

    validateUser:(request) => new Promise((resolve, reject) => {
        userHelper.validateUser(request.email, request.password).then(()=>{
            var token = jWTHelper.createJWT(request.email)
            resolve({accessToken:token});
        },(rej) => {
           reject(rej);
        });
    })

}
