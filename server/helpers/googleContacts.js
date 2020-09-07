const { google } = require('googleapis');
const Mongo = require('./mongoAPI');
const _mongo = new Mongo();
const googleAuth = require('../configurations/googleAuth');


let googleContacts = {};

googleContacts.createContact = (shopifyOrder) => {
  // Get tokens from mongoDB
  let tokens = {"access_token" : "ya29.a0AfH6SMBv8Xz6GHSGH0gozKKEg6wAP96ya3PEUv5wAjduzXrruWo1J0EK6DYeFMMWdIZbEbKcza4FkmVw0ae26A59GiGKGrNfbO4Ik1O0zbB8yCut1PgQr6h2iPHte1szekFgKfsHLeW4kmngaMbwJsyEYgiLckXtIsI", "refresh_token" : "1//0gksgCDNXDOL1CgYIARAAGBASNwF-L9IrnE1zTJj0aZKjUsofQFBgoKnRl12EUU8ZauPms8dVD_PG7XkALTa_OROp11PY8ueYngA"}


  // Set Google token
  let oAuth2Client = googleAuth.getAuthClient();
  oAuth2Client.setCredentials(tokens);

  //Create contact
  const service = google.people({version: 'v1', auth: oAuth2Client});
  service.people.createContact({
      requestBody:  {
          emailAddresses: [{value: 'john@doe.com'}],
          names: [
          {
              displayName: 'John Doe',
              familyName: 'Doe',
              givenName: 'John',
          },
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


module.exports = googleContacts;