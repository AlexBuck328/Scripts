# Scripts

`mapshaper cb_2018_us_state_500k.shp -filter STATEFP=='30' -simplify dp 15% -proj wgs84 -o precision=.00001 format=geojson mt-state.json`