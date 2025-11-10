require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./Student');
const { faker } = require('@faker-js/faker');
const batchOptions = ['Batch A', 'Batch B', 'Batch C'];
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  await Student.deleteMany({});
  let students = [];
  for (let i = 1; i <= 50; i++) {
    students.push({
      name: faker.person.firstName() + " " + faker.person.lastName(),
      rollNo: (100 + i).toString(),
      email: faker.internet.email(),
      phone: faker.string.numeric(10),
      batch: faker.helpers.arrayElement(batchOptions),
      present: true
    });
  }
  await Student.insertMany(students);
  console.log('50 synthetic students seeded!');
  mongoose.disconnect();
});
