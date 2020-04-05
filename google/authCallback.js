const dotenv = require('dotenv');
const { google } = require('googleapis');
dotenv.config();

const { GOOGLE_APP_CLIENT_ID, GOOGLE_APP_CLIENT_SECRET, GOOGLE_APP_REDIRECT_URIS } = process.env;
const oAuth2Client = new google.auth.OAuth2(GOOGLE_APP_CLIENT_ID, GOOGLE_APP_CLIENT_SECRET, GOOGLE_APP_REDIRECT_URIS)

function googleAuthCallback(ctx) {
const code = ctx.query.code
  if (code) {
      // Get an access token based on our OAuth code
      oAuth2Client.getToken(code, function (err, tokens) {
          if (err) {
              console.log('Error authenticating')
              console.log(err);
          } else {
              console.log('Successfully authenticated');
              console.log("Tokens are: ", tokens);
              oAuth2Client.setCredentials(tokens);
              authed = true;
              ctx.redirect('/');
              //ctx.body = "<html><p>What?</p></html>"
          }
      });
  }
}

module.exports = googleAuthCallback;