const mongoose = require("mongoose");

const databaseConnection = (mongoURI) => {
  mongoose
    .connect(mongoURI)
    .then((con) =>
      console.log("Database is connected on: " + con.connection.host)
    )
    .catch((error) => console.log(`Database connection error is: ${error}`));
};

module.exports = databaseConnection;
