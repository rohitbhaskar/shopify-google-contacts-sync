const dotenv = require('dotenv');
dotenv.config();
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER, MONGO_DB } = process.env;

const monogoDbConfig = {
    USERNAME    : MONGO_USERNAME,
    PASSWORD    : MONGO_PASSWORD,
    CLUSTER     : MONGO_CLUSTER,
    DB          : MONGO_DB,
};

monogoDbConfig.URL = `mongodb+srv://` + 
    `${monogoDbConfig.USERNAME}:${monogoDbConfig.PASSWORD}@` + 
    `${monogoDbConfig.CLUSTER}.1vqln.mongodb.net/` + 
    `${monogoDbConfig.DB}?retryWrites=true&w=majority`;


module.exports = monogoDbConfig;