const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://palkarsanavi_db_user:f7GX99I8narzQIE2@ac-oj3l4iz-shard-00-00.mlo79lk.mongodb.net:27017,ac-oj3l4iz-shard-00-01.mlo79lk.mongodb.net:27017,ac-oj3l4iz-shard-00-02.mlo79lk.mongodb.net:27017/?ssl=true&replicaSet=atlas-ra5cf4-shard-0&authSource=admin&appName=Cluster0"
)
.then(() => {
  console.log("CONNECTED SUCCESSFULLY");
  process.exit(0);
})
.catch((err) => {
  console.error(err);
  process.exit(1);
});