const dotenv = require('dotenv');
dotenv.config();
const { GOOGLE_APP_CLIENT_ID, GOOGLE_APP_CLIENT_SECRET, GOOGLE_APP_REDIRECT_URIS } = process.env;
const { google } = require('googleapis');


let googleAuth = {};

googleAuth.oAuth2Client = null;

googleAuth.setAuthClient = () => {
  try {
    googleAuth.oAuth2Client = new google.auth.OAuth2(GOOGLE_APP_CLIENT_ID, GOOGLE_APP_CLIENT_SECRET, GOOGLE_APP_REDIRECT_URIS);
    return true;
  }
  catch(e) {
    console.log('server/configurations/googleAuth.j -> Error in creating google oAuth2Client');
    return false;
  }
}

googleAuth.getAuthClient = () => {
  try {
    if (googleAuth.oAuth2Client) return googleAuth.oAuth2Client;
    else return null;
  }
  catch(e) {
    console.log('server/configurations/googleAuth.j -> Google oAuth2Client wasnt created earlier');
  }
}

module.exports = googleAuth;