const fs = require("fs");
const csv = require("csvtojson");
const chalk = require("chalk");
const gjv = require("geojson-validation");

const inFilePath = __dirname + "/../project-files/MT_Features_20200701.txt";
const outFilePath = __dirname + "/../data/mt-glaciers.json";
const filteredFeature = "Glacier";


