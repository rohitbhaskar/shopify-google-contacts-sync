const phone = require('phone');
const { google } = require('googleapis');
const Mongo = require('./mongoAPI');
const _mongo = new Mongo();
const googleAuth = require('../configurations/googleAuth');


let googleContacts = {};

googleContacts.createContact = (shopifyOrder) => {
  let tokens = null;

  // Get tokens from mongoDB
  //let tokens = {"access_token" : "ya29.a0AfH6SMBv8Xz6GHSGH0gozKKEg6wAP96ya3PEUv5wAjduzXrruWo1J0EK6DYeFMMWdIZbEbKcza4FkmVw0ae26A59GiGKGrNfbO4Ik1O0zbB8yCut1PgQr6h2iPHte1szekFgKfsHLeW4kmngaMbwJsyEYgiLckXtIsI", "refresh_token" : "1//0gksgCDNXDOL1CgYIARAAGBASNwF-L9IrnE1zTJj0aZKjUsofQFBgoKnRl12EUU8ZauPms8dVD_PG7XkALTa_OROp11PY8ueYngA"}
  _mongo.search('storeDetails', {shopify_store: shopifyOrder.domain})
  .then(result=> {
    console.log(`Found store tokens on mongo: ${result}`);
    tokens = {'access_token': result[result.length - 1].access_token, 'refresh_token': result[result.length - 1].refresh_token};

    if(tokens) {
      // Set Google token
      let oAuth2Client = googleAuth.getAuthClient();
      oAuth2Client.setCredentials(tokens);

      //Create contact
      const service = google.people({version: 'v1', auth: oAuth2Client});
      try{
        service.people.createContact({
            requestBody:  {
              addresses: [
                {
                  "type": "shipping",
                  "streetAddress": shopifyOrder.payload.shipping_address.address1,
                  "extendedAddress": shopifyOrder.payload.shipping_address.address2,
                  "city": shopifyOrder.payload.shipping_address.city,
                  "region": shopifyOrder.payload.shipping_address.province,
                  "postalCode": shopifyOrder.payload.shipping_address.zip,
                  "country": shopifyOrder.payload.shipping_address.country,
                  "countryCode": shopifyOrder.payload.shipping_address.country_code
                },
                {
                  "type": "billing",
                  "streetAddress": shopifyOrder.payload.billing_address.address1,
                  "extendedAddress": shopifyOrder.payload.billing_address.address2,
                  "city": shopifyOrder.payload.billing_address.city,
                  "region": shopifyOrder.payload.billing_address.province,
                  "postalCode": shopifyOrder.payload.billing_address.zip,
                  "country": shopifyOrder.payload.billing_address.country,
                  "countryCode": shopifyOrder.payload.billing_address.country_code
                }
              ],
              events: [
                {
                  date: {
                    "year": new Date(shopifyOrder.payload.created_at).getFullYear(),
                    "month": new Date(shopifyOrder.payload.created_at).getMonth() + 1,
                    "day": new Date(shopifyOrder.payload.created_at).getDate()
                  },
                  type: "order_date"
                },
                {
                  date: {
                    "year": new Date(shopifyOrder.payload.customer.created_at).getFullYear(),
                    "month": new Date(shopifyOrder.payload.customer.created_at).getMonth() + 1,
                    "day": new Date(shopifyOrder.payload.customer.created_at).getDate()
                  },
                  type: "customer_creation_date"
                }
              ],
              emailAddresses: [
                {
                  value: shopifyOrder.payload.email,
                  type: "work"
                },
                {
                  value: shopifyOrder.payload.contact_email,
                  type: "contact_email"
                },
                {
                  value: shopifyOrder.payload.customer.email,
                  type: "customer_email"
                }
              ],
              names: [
                {
                  givenName: `${shopifyOrder.payload.name} ${shopifyOrder.payload.shipping_address.first_name} ${shopifyOrder.payload.line_items[0].title.split(' ')[1]} ${shopifyOrder.payload.shipping_address.city} ${shopifyOrder.payload.shipping_address.province_code}`
                }
              ],
              phoneNumbers: [
                {
                  value: phone(shopifyOrder.payload.shipping_address.phone, 'IND')[0],
                  type: "work"
                },
                {
                  value: phone(shopifyOrder.payload.billing_address.phone, 'IND')[0],
                  type: "billing_phone"
                },
                {
                  value: phone(shopifyOrder.payload.customer.phone, 'IND')[0],
                  type: "customer_phone"
                }
              ],
              userDefined: [
                {
                  "key": "Order No.",
                  "value": shopifyOrder.payload.name
                },
                {
                  "key": "Order Date",
                  "value": new Date(shopifyOrder.payload.created_at).toDateString()
                },
                {
                  "key": "Product",
                  "value": shopifyOrder.payload.line_items[0].title
                },
                {
                  "key": "Payment Status",
                  "value": shopifyOrder.payload.financial_status
                },
                {
                  "key": "Order Status Url",
                  "value": shopifyOrder.payload.order_status_url
                }
              ]
            }
        })
        .then(result=>{
            console.log('Contact created');
        })
        .catch(error=>{
            console.log(error);
        })
      }
      catch(e){
        console.log(`Error in creation of google contact: ${e}`);
      }
    }
  })
  .catch(error => {
    console.log(`Error at server/helpers/googleContacts - createContact -> Store tokens not found`);
  })
}


module.exports = googleContacts;