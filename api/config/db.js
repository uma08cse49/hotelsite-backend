// const mongoose = require('mongoose');

// const connectWithDB = () => {
//   mongoose.set('strictQuery', false);
//   mongoose
//     .connect(process.env.DB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(console.log(`DB connected successfully`))
//     .catch((err) => {
//       console.log(`DB connection failed`);
//       console.log(err);
//       process.exit(1);
//     });
// };


// module.exports = connectWithDB;



const mongoose = require("mongoose");

const connectWithDB = async () => {
  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB connected successfully");
  } catch (err) {
    console.log("DB connection failed");
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectWithDB;
