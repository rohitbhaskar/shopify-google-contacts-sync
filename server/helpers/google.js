const Mongo = require('./mongoAPI');
const _mongo = new Mongo();

const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();
const { GOOGLE_APP_CLIENT_ID, GOOGLE_APP_CLIENT_SECRET, GOOGLE_APP_REDIRECT_URIS } = process.env;
const oAuth2Client = new google.auth.OAuth2(GOOGLE_APP_CLIENT_ID, GOOGLE_APP_CLIENT_SECRET, GOOGLE_APP_REDIRECT_URIS);
let authed = false;

class Google{

    //static thisContext = this;

    auth(ctx){
        
        //if (!authed) {
            // Generate an OAuth URL and redirect there
            let url = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                //scope: 'https://www.googleapis.com/auth/contacts.readonly',
                scope: 'https://www.googleapis.com/auth/contacts',
                prompt: 'consent'
                //scope: 'https://www.googleapis.com/auth/userinfo.profile'
            });
            //url = url + (url.includes('?')) ? '' : '?' + 'testParam=testVal';
            // if(url.includes('?')) url = url+'&testParam=testVal';
            // else url = url+'?testParam=testVal';

            ctx.body = url;
      
        //}
    }

    async authCallback(ctx){
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
                    _mongo.insert("storeDetails",{"access_token":tokens.access_token, "refresh_token":tokens.refresh_token,"shopify_store":ctx.cookies.get('shopOrigin')})
                    .then(result=>{
                        // oAuth2Client.setCredentials(tokens);
                        // authed = true;
                        // ctx.redirect('/');
                        console.log('Inserted data into Mongo: ', result);
                    })  
                    .catch(error=>{

                    })
                    oAuth2Client.setCredentials(tokens);
                    authed = true;

                    //Create contact
                    //TODO - this API call will not happen here
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
                    ctx.redirect('/');
                   
                    //ctx.body = "<html><p>What?</p></html>"
                }
            });
        }
    }

    async createContact(body){
        const service = google.people({version: 'v1', auth: oAuth2Client});
        const result = await service.people.createContact({
            requestBody: body
        });
        return result;
       
    }


}

module.exports = Google;