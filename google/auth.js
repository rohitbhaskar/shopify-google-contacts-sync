const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const { GOOGLE_APP_CLIENT_ID, GOOGLE_APP_CLIENT_SECRET, GOOGLE_APP_REDIRECT_URIS } = process.env;

const oAuth2Client = new google.auth.OAuth2(GOOGLE_APP_CLIENT_ID, GOOGLE_APP_CLIENT_SECRET, GOOGLE_APP_REDIRECT_URIS);

var authed = false;

function googleAuth(ctx) {
  if (!authed) {
      // Generate an OAuth URL and redirect there
      const url = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: 'https://www.googleapis.com/auth/contacts.readonly',
          prompt: 'consent'
          //scope: 'https://www.googleapis.com/auth/userinfo.profile'
      });
      ctx.body = url;
      //ctx.redirect(url);
  } else {
      //const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      const service = google.people({version: 'v1', auth: oAuth2Client});
      // gmail.users.labels.list({
      //     userId: 'me',
      // }, (err, res) => {
      //     if (err) return console.log('The API returned an error: ' + err);
      //     const labels = res.data.labels;
      //     if (labels.length) {
      //         console.log('Labels:');
      //         labels.forEach((label) => {
      //             console.log(`- ${label.name}`);
      //         });
      //     } else {
      //         console.log('No labels found.');
      //     }
      // });
      service.people.connections.list({
          resourceName: 'people/me',
          pageSize: 10,
          personFields: 'names,emailAddresses,phoneNumbers',
      }, (err, res) => {
          if (err) return console.error('The API returned an error: ' + err);
          else console.log('Logged in');
          const connections = res.data.connections;
          if (connections) {
          console.log('Connections:');
          connections.forEach((person) => {
              if (person.names && person.names.length > 0) {
              console.log(person.names[0].displayName);
              console.log(person);
              } else {
              console.log('No display name found for connection.');
              }
          });
          } else {
          console.log('No connections found.');
          }
      });
      ctx.body = '';
      
  }
}

module.exports = googleAuth;