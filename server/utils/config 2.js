const fs = require("fs");

module.exports = {
  mongo: {
    protocol: "mongodb",
    usr: process.env.MONGO_INITDB_ROOT_USERNAME,
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD
      ? process.env.MONGO_INITDB_ROOT_PASSWORD
      : process.env.MONGO_INITDB_ROOT_PASSWORD_FILE
      ? fs.readFileSync(process.env.MONGO_INITDB_ROOT_PASSWORD_FILE, "utf-8")
      : "",
    hostname: process.env.MONGO_HOSTNAME,
    dbName: "sustainability-db",
    get url() {
      return `${this.protocol}+srv://${this.usr}:${this.pwd}@${this.hostname}`;
    },
  },

  "app-port": process.env.APP_PORT,
  _injectMongoValues(newValAsObj) {
    Object.assign(this.mongo, newValAsObj);
    return this;
  },
};
