/**
 * Processes the supplied method call and provides the ThreadLocal context to the next() method call hierarchy.
 * 
 * It determines whether there's any dynamic data available. The purpose of dynamic data is to store per request ThreadLocal style
 * information (such as, transactionID). If such data is available, it is stored in a ThreadLocal style storage. Otherwise, normal
 * processing continues.
 *
 * @author Manoj Jain
 * @version 1.0
 * @since 1.0
 */

'use strict';
const cls = require('cls-hooked');
var constants = require('../../modules/commons/Constants');
const shortid = require('shortid');

module.exports.init = function() {

    const ns = cls.createNamespace('session');

    return function clsifyMiddleware(req, res, next) {
        ns.bindEmitter(req);
        ns.bindEmitter(res);

        ns.run(() => {

            if (req) {
                var ns = cls.getNamespace('session');
                var transactionid = req.headers[constants.HEADER_TRANS_ID];
                if(!transactionid) {
                    transactionid = shortid.generate();
                }
                ns.set('txID', transactionid);
            }
            next();
        });
    };
};