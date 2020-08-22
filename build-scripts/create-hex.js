const fs = require("fs");
const turf = require("@turf/turf");
const chalk = require("chalk");

fs.readFile(__dirname + "/../data/mt-glaciers.json", "utf8", (err, data) => {
    if (err) throw err;

    // parse the incoming GeoJSON text
    const glaciers = JSON.parse(data);

    createHexGrid(glaciers);
});

function createHexGrid(glaciers) {
    console.log(glaciers); // output will be limited in the terminal
    
    // Montana bounding box
    // [ minX, minY, maxX, maxY ]
    const bbox = [-103, 50, -117, 42];

    // define our cell Diameter
    const cellSide = 0.15;
    // define units
    const options = {
        units: "degrees"
    };
    // create the hex polygons
    let hexgrid = turf.hexGrid(bbox, cellSide, options);

    console.log(hexgrid);

    // call function to sum all points within each hexagon
    sumPoints(glaciers, hexgrid);
}

function sumPoints(glaciers, hexgrid) {
    // option for turf.booleanPointInPolygon()
    // and other variables don't
    // need redefined with each loop
    const options = {
        ignoreBoundary: true
    };

    let count;

    // // loop through each hex in hexgrid
    turf.featureEach(hexgrid, (hex, i) => {
        // reset counter to zero for each hex
        count = 0;

        // loop through each point point in glaciers
        turf.featureEach(glaciers, point => {
            // if the point is inside the hex
            if (turf.booleanPointInPolygon(point, hex, options)) {
                count++; // increment by one
            }
        });

        if (count > 0) {
            // output progress
            console.log(chalk.green("adding count of " + count + " to hex #: " + i));
        }

        // update hex properties with count
        hex.properties = Object.assign({}, hex.properties, {
            count: count
        });
    });

    console.log(chalk.blue("ready to write the hexgrid to file"));

    // truncate the coordinate precision to reduce file size
    hexgrid = turf.truncate(hexgrid, {
        precision: 5
    });

    writeHexGrid(hexgrid);
}

function writeHexGrid(hexgrid) {
    // stringify the hexgrid and write to file
    fs.writeFile(
        __dirname + "/../data/mt-hexgrid-glaciers-15.json",
        JSON.stringify(hexgrid),
        "utf-8",
        err => {
            if (err) throw err;
            console.log(chalk.green("done writing file!"));
        }
    );
}