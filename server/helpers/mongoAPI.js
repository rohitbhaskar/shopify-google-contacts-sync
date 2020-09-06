const MongoClient = require('mongodb').MongoClient
const _keys = require('../configurations/mongoDb.js')
var moment = require('moment-timezone');

class MongoAPI extends MongoClient {

    /**
    * Kind of contructor function that estalishes the connection with Mongo Database
    * and stores it in to the @property {client} this.client for future calls
    * 
    */
    async establishConnection() {
      console.log('Starting to establish mongo connection');
        try {
            this.client = await MongoClient.connect(_keys.URL, { useNewUrlParser: true, useUnifiedTopology: true });
            if (!this.client) { throw new Error("Error connecting to Database"); }
            else { console.log('Connection Succesful') }
        } catch (e) { console.log(e); }

    }
    
    /**
    * A simple function to check whether the conenction is already established or not
    * 
    * @returns {true|false}
    */
    isConnected() {
        if (this.client) { return true; }
        else { return false; }
    }

    /**
    * Wrapper function to the Monogo update, to update records in the database
    * 
    * @param {string} collection 
    * @param {Object} filter 
    * @param {Object} updateParams 
    * @param {Object} options 
    */
    async update(collection, filter, updateParams, options) {
        if (!this.isConnected()) { await this.establishConnection(); }

        try {
            const dbCollection = this.client.db(_keys.DB).collection(collection);
            const x = await dbCollection.updateOne(filter, updateParams, options);
        } catch (error) {
            console.log('DB Update Unsuccessfull');
            console.log(error);
        } finally {
            // this.client.close();
        }

    }

    /**
    * Wrapper function to the Mongo Bulk Insert <asynchronous>
    * 
    * @param {string} collection 
    * @param {Array} dataArray 
    */
    async bulkInsert(collection, dataArray) {
        if (!this.isConnected()) { await this.establishConnection(); }

        try {
            const bulk = this.client.db(_keys.DB).collection(collection).initializeUnorderedBulkOp();
            dataArray.forEach(data => { bulk.insert(data); });
            bulk.execute();
        }
        catch (error) { console.log(`Bulk Insert Unsuccessful \n ${error}`); }
        // finally { this.client.close() }

    }

    /**
    * Wrapper function to the Mongo Insert <asynchronous>
    * 
    * @param {string} collection 
    * @param {Array} Object 
    */
   async insert(collection, object) {
    if (!this.isConnected()) { await this.establishConnection(); }

    try {
         const client = this.client.db(_keys.DB).collection(collection);
         await client.insertOne(object);
    }
    catch (error) { console.log(`Insert Operation Unsuccessful \n ${error}`); }
    // finally { this.client.close() }

}

    /**
    * Wrapper function to the Mongo Bulk Delete <asynchronous>
    * 
    * @param {string} collection 
    * @param {Object|null} filter 
    */
    async bulkDelete(collection, filter = null) {
        if (!this.isConnected()) { await this.establishConnection(); }

        try {
            const client = this.client.db(_keys.DB).collection(collection);
            await client.deleteMany(filter);
        }
        catch (error) { console.log(`Bulk Delete Unsuccessful \n ${error}`); }
        // finally { this.client.close() }
    }

    /**
    * Wrapper function to the Mongo Find
    * 
    * @param {string} collection 
    * @param {Object|null} filter 
    * @returns {Object|null}
    */
    async search(collection, filter = null, sortParams = null) {
        if (!this.isConnected()) { await this.establishConnection(); }

        try {
            const dbCollection = this.client.db(_keys.DB).collection(collection);
            let foundItem = '';
            if(!sortParams) foundItem = await dbCollection.find(filter).toArray();
            else    foundItem = await dbCollection.find(filter).sort(sortParams).toArray();
            
            return foundItem;
        }
        catch (error) {
            console.log(`Search Query Unsuccessful \n ${error}`);
            return null;
        }
        // finally { this.client.close() }
    }

    
    async log(appName, fileName, orderID , logMessage) {
        if (!this.isConnected()) { await this.establishConnection(); }
        
        try{
            let currentTime = moment.tz('Asia/Kolkata').format('MMMM Do YYYY, h:mm:ss a');
            let data = {
                timestamp: currentTime,
                app: appName,
                file: fileName,
                message: logMessage,
                order: orderID.toString()
            };
            const dbCollection = this.client.db(_keys.DB).collection('logs');
            dbCollection.insertOne(data);
        } catch (error) { console.log(`Log Unsuccessful \n ${error}`); }

    }
}

module.exports = MongoAPI;


