import React, {useRef, useEffect,useState  } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import {Link} from "react-router-dom"
import {Amplify, API, graphqlOperation} from 'aws-amplify';
import awsconfig from '../../aws-exports'
import { listGpsdbs } from '../../graphql/queries';

const MapboxC = (props) => {

let state;
let corLength;
let idDataFilter;
let flagFunction = false;
let routeID = 0;
    //tokem MapBox
Amplify.configure(awsconfig);
mapboxgl.accessToken = 'pk.eyJ1IjoiZXN0dmFsZW56dWVsYSIsImEiOiJja3FoaGhpdXoxYThuMnVudTh4bmg3YmExIn0.FN1QSshNPIdsMigLVCL3vw';

function timeout(delay) {
  return new Promise( res => setTimeout(res, delay) );
}

const [gps, setGps] = useState([]); 







function prepareCoordinates(arrayCoordinates){ //This function filter the data only for unique ID of trip
  console.log(arrayCoordinates);
  const filterID = arrayCoordinates.id;
  idDataFilter = filterID;
  console.log(filterID);
  let data = arrayCoordinates.state;
  var coordinates = [];
 

  for (let index = 0; index < data.length; index++) {
    if (data[index].travelID == filterID) {
      const auxCoordinates = [data[index].lat, data[index].long, new Date(data[index].updatedAt) ];
      coordinates.push(auxCoordinates);
    }
  }
  console.log(coordinates);
  var sortedArray = coordinates.sort(function(a, b) {
    return b[2].getTime() - a[2].getTime();
  });
  flagFunction = true;
  return sortedArray;
}
function generateColor1(){
  return '#' +  Math.random().toString(16).substr(-6);
}



let clearCoordinates = prepareCoordinates(props.location.state); //call function to prepare coordiantes with first data
console.log('coordinates to plot ->', clearCoordinates);
const mapContainerRef = useRef(null);

// Initialize map when component mounts
useEffect( () => {
  

  const map = new mapboxgl.Map({
    container: mapContainerRef.current,
    style: "mapbox://styles/estvalenzuela/cl9mxv2om000a14n74lmttfym",
    center: [parseFloat(clearCoordinates[0][0]),parseFloat(clearCoordinates[0][1])],   //Coordinates to start the map
    zoom: 1,     //Default zoom
  });


  const fetchdataGPSrepeat = setInterval(async() => {
      try  {
        const gpsData = await API.graphql(graphqlOperation(listGpsdbs))
        console.log(gpsData);
        const gpsList = gpsData.data.listGpsdbs.items;
        console.log('data', gpsList);
        setGps(gpsList);
        preparenewCoordinates(gpsList, flagFunction);
      }catch(error){
        console.log('error on fetching data!', error);
      }
      console.log('corlength', corLength);
     // console.log('GPS length', gpsList.length);
    
    state = gps;}, 2500);






  function preparenewCoordinates(arrayNewCoordinates, flag){
    if (flag == true) {
      routeID = routeID +1;
      console.log('preparenewCoordinates function',arrayNewCoordinates);
      var processNewCoordinates = [];
      for (let index = 0; index < arrayNewCoordinates.length; index++) {
        if (arrayNewCoordinates[index].travelID == idDataFilter) {
          const auxCoordinates = [arrayNewCoordinates[index].lat, arrayNewCoordinates[index].long, new Date(arrayNewCoordinates[index].updatedAt) ];
          processNewCoordinates.push(auxCoordinates);
        }
      }
  
      var sortedArray = processNewCoordinates.sort(function(a, b) {
        return b[2].getTime() - a[2].getTime();
      });
      
        const lengthNew = sortedArray.length;
        if (lengthNew != corLength) {
          corLength = lengthNew;
          console.log("New data available, creating new points ;)", lengthNew);
          console.log('New coordinates', sortedArray);
          console.log('New LAT', sortedArray[0]);
          new mapboxgl.Marker({ "color": generateColor1() }).setLngLat([parseFloat(sortedArray[0][0]),parseFloat(sortedArray[0][1])])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <h4 id="title-market-mapbox">`+sortedArray[0][2]+`</h4>
          <hr>
          <p id="title-market-mapbox">Latitud:`+sortedArray[0][0]+` </p>
          <p id="title-market-mapbox">Longitud:`+sortedArray[0][1]+` </p>
          `)).addTo(map);
          map.flyTo({center: [parseFloat(sortedArray[0][0]),parseFloat(sortedArray[0][1])],speed: 0.8,curve: 2, zoom: 15});
      
          map.removeLayer('layer-with-pulsing-dot');
          map.removeSource('dot-point');

          map.addSource('dot-point', {
            'type': 'geojson',
            'data': {
                    'type': 'FeatureCollection',
                    'features': [
                                {
                                'type': 'Feature',
                                'geometry': {
                                          'type': 'Point',
                                          'coordinates': [parseFloat(sortedArray[0][0]),parseFloat(sortedArray[0][1])]
                                          }
                                }
                              ]
                      }
                    });
          
          map.addLayer({
                      'id': 'layer-with-pulsing-dot',
                      'type': 'symbol',
                      'source': 'dot-point',
                      'layout': {
                          'icon-image': 'pulsing-dot'
                      }
                      });

                      map.addSource('route'+routeID.toString()+'', {
                        'type': 'geojson',
                        'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                        'type': 'LineString',
                        'coordinates': [
                              [parseFloat(sortedArray[0][0]),parseFloat(sortedArray[0][1])],
                              [parseFloat(sortedArray[1][0]),parseFloat(sortedArray[1][1])]
                              ]
                            }
                        }
                      });
      
      map.addLayer({
            'id': 'route'+routeID.toString()+'',
            'type': 'line',
            'source': 'route'+routeID.toString()+'',
            'layout': {
                      'line-join': 'round',
                      'line-cap': 'round'
                      },
            'paint': {
                    'line-color': '#3B60E4',
                    'line-width': 6
            }
      });
      
        }
       // const element = arrayNewCoordinates[index];
        
      }
  }
  




  async function createData(){

    let coordinatesRoute = []; //Coordinates to push
    corLength = clearCoordinates.length;
    let firstPoint = corLength-1;
    let geojson_init = {
      type: 'FeatureCollection',
      features: [
        {        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(clearCoordinates[firstPoint][0]), parseFloat(clearCoordinates[firstPoint][1])],
          properties: {
            title: clearCoordinates[firstPoint][2],
            description: 'Lat:'+clearCoordinates[firstPoint][0]+', Lon:+'+clearCoordinates[firstPoint][1]
          }
        }}
      ]
    };
    geojson_init.features.map((feature) =>
    new mapboxgl.Marker({ "color": generateColor() }).setLngLat(feature.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h4 id="title-market-mapbox">Inicio del viaje: `+clearCoordinates[firstPoint][2]+`</h4>
        <hr>
        <p id="title-market-mapbox">Latitud:`+clearCoordinates[firstPoint][0]+` </p>
        <p id="title-market-mapbox">Longitud:`+clearCoordinates[firstPoint][1]+` </p>
        `
      )).addTo(map)
  );

    for (let index = 0; index < clearCoordinates.length; index++) {
      console.log('length', clearCoordinates.length);
      // let geojson = {
      //   type: 'FeatureCollection',
      //   features: [
      //     {        type: 'Feature',
      //     geometry: {
      //       type: 'Point',
      //       coordinates: [parseFloat(clearCoordinates[index][0]), parseFloat(clearCoordinates[index][1])],
      //       properties: {
      //         title: clearCoordinates[index][2],
      //         description: 'Lat:'+clearCoordinates[index][0]+', Lon:+'+clearCoordinates[index][1]
      //       }
      //     }}
      //   ]
      // };

      // Create default markers
      // geojson.features.map((feature) =>
      //   new mapboxgl.Marker({ "color": generateColor() }).setLngLat(feature.geometry.coordinates)
      //       .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
      //       <h4 id="title-market-mapbox">`+clearCoordinates[index][2]+`</h4>
      //       <hr>
      //       <p id="title-market-mapbox">Latitud:`+clearCoordinates[index][0]+` </p>
      //       <p id="title-market-mapbox">Longitud:`+clearCoordinates[index][1]+` </p>
      //       `
      //     )).addTo(map)
      // );
      coordinatesRoute.push([parseFloat(clearCoordinates[index][0]), parseFloat(clearCoordinates[index][1])]);
    }
    console.log('Coordinates', coordinatesRoute);



    const size = 200; //Point Size
    const pulsingDot = {
                      width: size,
                      height: size,
                      data: new Uint8Array(size * size * 4),
                      onAdd: function () {
                          const canvas = document.createElement('canvas');
                          canvas.width = this.width;
                          canvas.height = this.height;
                          this.context = canvas.getContext('2d');
                      },
     
                      // Call once before every frame where the icon will be used.
                      render: function () {
                          const duration = 500; //pulse duration
                          const t = (performance.now() % duration) / duration;
                          const radius = (size / 2) * 0.3;
                          const outerRadius = (size / 2) * 0.7 * t + radius;
                          const context = this.context;
                          // Draw the outer circle.
                          context.clearRect(0, 0, this.width, this.height);
                          context.beginPath();
                          context.arc(this.width/2, this.height/2, outerRadius, 0, Math.PI*2);
                          context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
                          context.fill();
                          // Draw the inner circle.
                          context.beginPath();
                          context.arc(this.width/2, this.height/2, radius, 0, Math.PI*2 );
                          context.fillStyle = 'rgba(255, 100, 100, 1)';
                          context.strokeStyle = 'white';
                          context.lineWidth = 2 + 4 * (1 - t);
                          context.fill();
                          context.stroke();
                          // Update this image's data with data from the canvas.
                          this.data = context.getImageData( 0, 0, this.width, this.height).data;
                          // Continuously repaint the map, resulting
                          // in the smooth animation of the dot.
                          map.triggerRepaint();
                          
                          // Return `true` to let the map know that the image was updated.
                          return true;
                      }
                    };
                    map.on('load', () => {
                      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
                      
                      map.addSource('dot-point', {
                                    'type': 'geojson',
                                    'data': {
                                            'type': 'FeatureCollection',
                                            'features': [
                                                        {
                                                        'type': 'Feature',
                                                        'geometry': {
                                                                  'type': 'Point',
                                                                  'coordinates': [parseFloat(clearCoordinates[0][0]),parseFloat(clearCoordinates[0][1])], // icon position [lng, lat]
                                                                  'properties': {
                                                                                  'title': '16:35:00',
                                                                                  'description': 'Lat: -90.0578, Lon: 47.54'
                                                                                }
                                                                  }
                                                        }
                                                      ]
                                              }
                                            });
                                            console.log('Coordinates inside', coordinatesRoute);
                                            map.addSource('route', {
                                              'type': 'geojson',
                                              'data': {
                                              'type': 'Feature',
                                              'properties': {},
                                              'geometry': {
                                              'type': 'LineString',
                                              'coordinates': coordinatesRoute
                                                  }
                                              }
                                            });
              
                      map.addLayer({
                        'id': 'layer-with-pulsing-dot',
                        'type': 'symbol',
                        'source': 'dot-point',
                        'layout': {
                            'icon-image': 'pulsing-dot'
                        }
                        });
                        map.addLayer({
                          'id': 'route',
                          'type': 'line',
                          'source': 'route',
                          'layout': {
                                    'line-join': 'round',
                                    'line-cap': 'round'
                                    },
                          'paint': {
                                  'line-color': '#3B60E4',
                                  'line-width': 6
                          }
              });

                      });
                    

                

        // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    await timeout(3000); //for 1 sec delay
    map.flyTo({center: [parseFloat(clearCoordinates[0][0]),parseFloat(clearCoordinates[0][1])],speed: 0.8, curve: 2, zoom: 15});
  }
  
  
  function generateColor(){
    return '#' +  Math.random().toString(16).substr(-6);
  }

  createData();

  return () => clearInterval(fetchdataGPSrepeat);  

}, []);

return( 
  <div>
  <div className="page-header">
    <h3 className="page-title">
    Mis Viajes
    </h3>
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        
        <li className="breadcrumb-item"><Link to="/dashboard">Mis Viajes</Link></li>
        <li className="breadcrumb-item active" aria-current="page">#{props.location.state.id}</li>
      </ol>
    </nav>
  </div>
  <div className="row">
    <div className="col-12 grid-margin stretch-card">
      <div className="card">
      <div className="card-body">
          <h4 className="card-title">Viaje #{props.location.state.id}</h4>
      <div className="map-container" ref={mapContainerRef} />
      </div>
            </div>
            </div>
            </div>
      </div>
);
}


export default MapboxC;