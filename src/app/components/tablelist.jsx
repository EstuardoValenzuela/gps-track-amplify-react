import React, {useEffect,  useState  } from 'react';

import {Amplify, API, graphqlOperation} from 'aws-amplify';
import awsconfig from '../../aws-exports'
import { listGpsdbs } from '../../graphql/queries';
import { FlightData } from '../models/FlightData';
import {Link} from "react-router-dom";

Amplify.configure(awsconfig);


const TableList = () => {
  function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
  }
  

  let state = FlightData;
  const [gps, setGps] = useState([]); 

  useEffect(() => {
    const waitTime = async() =>{
      await timeout(5000);
    }
    waitTime();    
    fetchGps();
  }, []);

  const fetchGps = async() =>{
    try  {
      const gpsData = await API.graphql(graphqlOperation(listGpsdbs))
      console.log(gpsData);
      const gpsList = gpsData.data.listGpsdbs.items;
      console.log('data', gpsList);
      setGps(gpsList);
    }catch(error){
      console.log('error on fetching data!', error);
    }
  }
  state = gps;
  function createRows(){ //This function clean the data and prepare the rows
    const waitTime = async() =>{
      await timeout(5000);
    }
    waitTime();   
    console.log('GPS', gps);
    var totalTrips = [];
    var tripsShow = [];
    for (let index = 0; index < state.length; index++) { //Iterate all data
      
      if (!totalTrips.includes(state[index].travelID)) { //Concatenate into the rows if the trip hadn't been dded before
        // if (state[index].currentPosicion == false) {
        //   statusTrip = 'badge badge-warning">En Ruta';
        //   console.log("set trip to complete");
        // }
        var uniqueTrip = [state[index].travelID, state[index].createdAt];
        tripsShow.push(uniqueTrip);
      //  htmlCode = htmlCode + '<tr><td>'+state[index].travelID+'</td><td>'+state[index].createdAt+'</td><td><label className="'+statusTrip+'</label></td><td><Link className="btn btn-primary" to={{pathname:"dashboard/mapbox", state: "hellow"}}><button type="button" className="btn btn-primary btn-icon-text" ><i className="mdi mdi-file-check btn-icon-prepend"></i>Monitorear</button></Link> &nbsp;<button type="button" className="btn btn-danger btn-icon-text"><i className="mdi mdi-upload btn-icon-prepend"></i>Eliminar</button></td></tr>';  
        totalTrips.push(state[index].travelID);
      }else{
        // if (state[index].currentPosicion == true) {
        //   statusTrip = 'badge badge-warning">En Ruta';
        // }
        console.log('Travel repeted!');
      }

    }
    return (tripsShow);
  };



    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Mis viajes </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
             <li className="breadcrumb-item"><a href="#" >Mis Viajes</a></li>

            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Mis Viajes</h4>
                {/* <p className="card-description">
                </p> */}
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Viaje</th>
                        <th>Fecha de Inicio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {createRows().map(columnTrip =>{
                          function timeout(delay) {
                            return new Promise( res => setTimeout(res, delay) );
                          }
                            const waitTime = async() =>{
                              await timeout(50000);
                            }
                            waitTime();   
                        console.log(columnTrip[0]);
                        return(
                          <tr key={columnTrip[0]}>
                            <td>{columnTrip[0]}</td>
                            <td>{columnTrip[1]}</td>
                            <td><label className="badge badge-success">Completado</label></td>
                            <td><Link className="btn btn-primary" to={{pathname:"dashboard/mapbox", state: {state, id:columnTrip[0]}}}><i className="mdi mdi-file-check btn-icon-prepend"></i>Monitorear</Link></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
        </div>
        </div>
    )
  }

export default TableList
