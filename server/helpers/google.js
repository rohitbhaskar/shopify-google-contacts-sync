const Mongo = require('./mongoAPI');
const _mongo = new Mongo();

let authed = false;

class Google{

    //static thisContext = this;

    auth(ctx){
        
        //if (!authed) {
            // Generate an OAuth URL and redirect there
            let oAuth2Client = require('../configurations/googleAuth').getAuthClient();
            let url = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                //scope: 'https://www.googleapis.com/auth/contacts.readonly',
                scope: 'https://www.googleapis.com/auth/contacts',
                prompt: 'consent'
                //scope: 'https://www.googleapis.com/auth/userinfo.profile'
            });
            ctx.body = url;
      
        //}
    }

    async authCallback(ctx){
        const code = ctx.query.code
        if (code) {
            // Get an access token based on our OAuth code
            let oAuth2Client = require('../configurations/googleAuth').getAuthClient();
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
                    
                    authed = true;

                    ctx.redirect('/');
                   
                    //ctx.body = "<html><p>What?</p></html>"
                }
            });
        }
    }

    // async createContact(body){
    //     const service = google.people({version: 'v1', auth: oAuth2Client});
    //     const result = await service.people.createContact({
    //         requestBody: body
    //     });
    //     return result;
       
    // }


}

module.exports = Google;