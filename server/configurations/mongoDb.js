const monogoDbConfig = {
    USERNAME    : 'admin',
    PASSWORD    : 'abcd1234',
    CLUSTER     : 'maincluster',
    DB          : 'shopify-google-contacts-app',
};

monogoDbConfig.URL = `mongodb+srv://` + 
    `${monogoDbConfig.USERNAME}:${monogoDbConfig.PASSWORD}@` + 
    `${monogoDbConfig.CLUSTER}.1vqln.mongodb.net/` + 
    `${monogoDbConfig.DB}?retryWrites=true&w=majority`;


module.exports = monogoDbConfig;