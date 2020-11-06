var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:R@duga12@telegram.zqx1v.mongodb.net/Telegram?retryWrites=true&w=majority";

export default class Database {
  public getUsers() {
    return new Promise((resolve, reject) => {
    console.log("running")
    const client = new MongoClient(uri, { useNewUrlParser: true });

    var users = client.connect(err => {
      const collection = client.db("test").collection("users");
      console.log("running2")

      var users = collection.find({}, { projection: { _id: 0, id: 1, name: 1 } }).toArray(function(err, result) {
        if (err) throw err;
        return result
      });
    });

    return users;
    });
  }

  public async addUser(user) {

  }
}
