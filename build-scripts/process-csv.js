const fs = require("fs");
const csv = require("csvtojson");
const chalk = require("chalk");
const gjv = require("geojson-validation");

const inFilePath = __dirname + "/../project-files/mt-glaciers";
const outFilePath = __dirname + "/../data/mt-glaciers.json";
const filteredFeature = "Glacier";

csv({
        delimiter: "|"
    })
    .fromFile(inFilePath)
    .then(jsonObj => {
        jsonToGeoJson(jsonObj);
    });

function jsonToGeoJson(jsonObj) {
    // function will loop through the JSON object
    // and construct a GeoJSON object retaining
    // desired data attributes (e.g., feature name)

    // geojson structure
    const geojson = {
        type: "FeatureCollection",
        features: []
    };

    let feature; // declaring the variable here is better
    // than repeatedly re-declaring within the
    // loop below

    let featureCount = 0; // counter variable to keep track below

    jsonObj.forEach(obj => {
        if (obj.FEATURE_CLASS === filteredFeature) {
            // build a GeoJSON feature for each
            // following the GeoJSON specification (i.e., lon, lat)
            feature = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [+obj.PRIM_LONG_DEC, +obj.PRIM_LAT_DEC]
                },
                properties: {
                    COUNTY_NAME: obj.COUNTY_NAME,
                    ELEV_IN_FT: obj.ELEV_IN_FT,
                    FEATURE_CLASS: obj.FEATURE_CLASS,
                    FEATURE_NAME: obj.FEATURE_NAME,
                    PRIM_LAT_DEC: obj.PRIM_LAT_DEC,
                    RIM_LONG_DEC: obj.RIM_LONG_DEC,
                    STATE_ALPHA: obj.STATE_ALPHA,
                    STATE_NUMERIC: obj.STATE_NUMERIC,
                }
            };
            // push the feature into the features array
            geojson.features.push(feature);
            featureCount++;
        }
    });
    console.log(chalk.green(`${featureCount} "${filteredFeature}" features filtered from CSV file`));

    // update the jsonToGeoJson() function with the call to validateGeoJson
    validateGeoJson(geojson);
}

function validateGeoJson(geojson) {
    // function will validate GeoJSON structure
    // check to see if the GeoJSON is valid
    if (gjv.valid(geojson)) {
        console.log(chalk.green("this is valid GeoJSON!"));

        // ... update call to validate GeoJSON
        writeToFile(geojson);
    } else {
        console.log(chalk.red("Sorry, not valid GeoJSON."));
    }
}

function writeToFile(geojson) {
    // write output file
    fs.writeFile(outFilePath, JSON.stringify(geojson), "utf-8", err => {
        if (err) throw err;
        
        //confirmation file has written
        console.log(chalk.green("done writing file"));
    });
}