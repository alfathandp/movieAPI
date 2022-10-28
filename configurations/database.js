const {MongoClient} = require('mongodb');
const _uri = process.env.MONGODB_URI;

// coll = collection
const dbConnect = (coll, callback, coll2) => {
    MongoClient.connect(_uri)
      .then(async (client) => {
        const db = client.db('sample_mflix').collection(coll);
        let db2;
        if (coll2) {
          db2 = client.db('sample_mflix').collection(coll2);
        }
        await callback(db,db2);
        client.close();
      })
};

module.exports = dbConnect;

