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
const marketStackServiceClient = require('../clients/MarketStackServiceClient')

module.exports = {

    getStockTicker:(request) => new Promise((resolve, reject) => {

        marketStackServiceClient.getStockTicker(request).then((result) => {

            if(result != undefined) {
                resolve(result);
            }

        }, (rej) => {
            reject(rej);
        }).catch(error => {
            reject(error);
        });
    })

}
