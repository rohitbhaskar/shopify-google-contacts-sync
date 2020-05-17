const monogoDbConfig = {
    USERNAME    : 'shipping-service-selector',
    PASSWORD    : 'mongoelevar1234',
    CLUSTER     : 'main-cluster',
    DB          : 'elevar-sports',
};

monogoDbConfig.URL = `mongodb+srv://` + 
    `${monogoDbConfig.USERNAME}:${monogoDbConfig.PASSWORD}@` + 
    `${monogoDbConfig.CLUSTER}-ybjui.mongodb.net/` + 
    `${monogoDbConfig.DB}?retryWrites=true&w=majority`;


module.exports = monogoDbConfig;