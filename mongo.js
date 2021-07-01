const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide appropriate arguments");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];


mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  Name: String,
  Number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  Name: name,
  Number: number,
});

if (name !== undefined && number !== undefined)
  person.save().then((result) => {
    console.log("person saved!");
    mongoose.connection.close();
  });
else {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(person.Name + " " + person.Number);
    });
    mongoose.connection.close();
  });
}
