import fs from 'fs';
import csvParse from 'csv-parse';

// request first file
fs.readFile('../data/mt-state.json', 'utf8', (err, geojson) => {

    if (err) throw err;
    // nested call for the second (could use Promise or async solution)
    fs.readFile('../project-files/mt-glaciers.csv', 'utf8', (err, csvString) => {

        if (err) throw err; // stop the script if error

        // parse the CSV file from text to array of objects
        csvParse(csvString, {
            columns: true
        }, (err, csvData) => {

            bindData(JSON.parse(geojson), csvData);

        });
    })
});

function bindData(geojson, csvData) {

    // loop through the features
    geojson.features.forEach((feature) => {

        // set a variable to 0
        let count = 0;

        // loop through the array of CSV data objects
        csvData.forEach((row) => {

            // if IDs match
            if (feature.properties.STATEFP === row.STATE_NUMERIC) {
                // increment the count for that feature
                count++
            }

        });

        // when done looping, add the count as a feature property
        feature.properties.count = count;

    });

    // done with data bind
    writeFile(geojson);

}

function writeFile(geojson) {

    fs.writeFile('../data/mt-glacier-counts.json', JSON.stringify(geojson), 'utf8', function (err) {

        if (err) throw err;

        console.log('File all done. Great success!');
    })

}