const fs = require("fs");
require("dotenv").config();
const Tour = require("../models/tours.model");

// Connecting Database
require("./../db")
  .connectDB()
  .then(() => console.log("DB Connected Successfully!"));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/vistasTour.json`));

async function importDevData() {
  try {
    console.log("Populating DataBase with dev data!");
    await Tour.create(tours);
    console.log("Development Data imported successfully!!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

async function deleteDevData() {
  try {
    console.log("Deleting dev data from DataBase!");
    await Tour.deleteMany();
    console.log("Development data deleted successfully!!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

if (process.argv[2] === "--import") importDevData();
if (process.argv[2] === "--delete") deleteDevData();
