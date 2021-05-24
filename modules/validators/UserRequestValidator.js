/**
 *User creation request validation with Joi.
 *
 * @author Manoj Jain
 * @since 1.0
 * @version 1.0
 */

const Joi = require('joi');

const userValidator = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } } ).required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).message('Password must be alphanumeric min and max character is 3 and 30 characters respectively')
});

module.exports = { userValidator}
