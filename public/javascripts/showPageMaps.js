mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [ 79.0821,21.1498], // starting position [lng, lat]
    zoom: 6, // starting zoom
});
