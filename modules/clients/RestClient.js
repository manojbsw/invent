/**
 * Rest client which is used to communicate with outside entity.
 * This client exposes, GET and PUT method at present, We can add PUT, PATCH etc. as on when require.
 *
 * @author Manoj Jain
 * @since 1.0
 * @version 1.0
 */

const request = require('request-promise');
const cls = require('cls-hooked');
const logger = require('../utils/Logger');
const constant = require('../commons/Constants');

function RestClient() {}

function addTransId(headers) {
  const ns = cls.getNamespace('session');
  if (ns) {
    headers[constant.HEADER_TRANS_ID] = ns.get('txID');
  }
}

RestClient.prototype.postRequest = function (url, headerJsonObject, requestBody) {
  addTransId(headerJsonObject);

  const options = {
    method: 'POST',
    uri: url,
    body: requestBody,
    headers: headerJsonObject,
    resolveWithFullResponse: true,
    json: true,
  };

  return new Promise((resolve, reject) => {
    requestWithRefreshToken(options)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        logger.error(`Error in Post() call of infra layer error: ${err}`);
        reject(err);
      });
  });
};


RestClient.prototype.getRequest = function (url, headerJsonObject) {
  addTransId(headerJsonObject);
  const options = {
    method: 'GET',
    uri: url,
    headers: headerJsonObject,
    resolveWithFullResponse: true,
    json: true,
  };

  return new Promise((resolve, reject) => {
    request(options)
       .then(function (response) {
          resolve(response);
       })
       .catch(function (err) {
          logger.error(`Error in Get() call of infra layer error: ${err}`);
          reject(err);
       });
 });

};


module.exports = RestClient;
