const fs = require("fs");
require("dotenv").config();
const Tour = require("../models/tours.model");
const User = require("../models/users.model");
const Review = require("../models/reviews.model");

// Connecting Database
require("./../db")
  .connectDB()
  .then(() => console.log("DB Connected Successfully!"));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/vistasTour.json`));

const users = JSON.parse(fs.readFileSync(`${__dirname}/mydata/users.json`));

const reviews = JSON.parse(fs.readFileSync(`${__dirname}/mydata/reviews.json`));

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

const importUserData = async () => {
  try {
    console.log("Populating Database with User data!");
    await User.create(users);
    console.log("User Data imported successfully!!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

const importReviewsData = async () => {
  try {
    console.log("Populating Database with Review data!");
    await Review.create(reviews);
    console.log("Review Data imported successfully!!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

if (process.argv[2] === "--import-user") importUserData();
if (process.argv[2] === "--import-review") importReviewsData();
if (process.argv[2] === "--import-dev") importDevData();
if (process.argv[2] === "--delete-dev") deleteDevData();
