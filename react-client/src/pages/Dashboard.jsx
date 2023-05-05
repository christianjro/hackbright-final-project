import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LeaderboardChart from '../components/LeaderboardChart';
import TripHistoryChart from '../components/TripHistoryChart';
import AirQualityIndexChart from '../components/AirQualityIndexChart';


export default function Dashboard({trips, userInfo, handleTripsUpdate, location}) {
    const [leaderboardData, setLeaderboardData] = useState([])
    const [userTotalGHGEmissions, setUserTotalGHGEmissions] = useState(0)
    const [airQualityIndex, setAirQualityIndex] = useState(null)
    const navigate = useNavigate()

    const airNowAPIKey = process.env.REACT_APP_AIRNOW_API_KEY

    const recentTrips = trips.slice(0, 3)

    const usersTrips = recentTrips.map((trip) => {
        return (
          <div key={trip.id} className="card my-3 mx-auto border-2 border-black bg-dark-subtle"> 
            <div className="card-body">
              <h5 className="card-title text-light">{trip.name} </h5>
              <p className="card-text text-secondary">
                Origin: {trip.origin} <br/>
                Destination: {trip.destination} <br/>
                Travel Mode: {trip.mode} 
              </p>
            </div>
            <div className="card-footer bg-transparent text-secondary text-end border-dark">GHG Emissions: {trip.ghg_emissions > 0 ? trip.ghg_emissions.toFixed(4) : trip.ghg_emissions} MTCO2e</div>
          </div>
        )
    })

    useEffect(() => {
        let totalGHGEmissions = 0
        for (const i in trips) {
            const trip = trips[i]
            totalGHGEmissions += trip.ghg_emissions
        }
        setUserTotalGHGEmissions(totalGHGEmissions)
    }, [trips]) 


    useEffect(() => {
        fetch("/feed")
            .then(response => response.json())
            .then(data => {
                let friendGHGEmissions = []
                for (let friend in data) {
                    let totalGHGEmissions = 0
                    console.log(friend)
                    for (const j in data[friend]) {
                        const trip = data[friend][j]
                        totalGHGEmissions += trip.ghg_emissions
                        console.log(trip)
                    }
                    friendGHGEmissions.push({"user": friend, "totalGHGEmissions": totalGHGEmissions})
                    totalGHGEmissions = 0
                }
                console.log("*****")
                console.log(friendGHGEmissions)
                friendGHGEmissions.push({"user": "Yourself", "totalGHGEmissions": userTotalGHGEmissions})

                const sortedData = [...friendGHGEmissions].sort((a,b) => a.totalGHGEmissions - b.totalGHGEmissions)
                setLeaderboardData(sortedData) 
            })
    }, [trips, userTotalGHGEmissions])
    
    console.log(userTotalGHGEmissions)
    console.log(trips)
    console.log(leaderboardData)

    useEffect(() => {
      console.log("this is location")
      console.log(location)
      if (location) {
        const url = `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${location.latitude}&longitude=${location.longitude}&distance=30&API_KEY=${airNowAPIKey}`
        fetch(url)
          .then(response => response.json())
          .then(data => setAirQualityIndex(data[0]))
      }
    }, [location])

    return (
        <div className="container">
            <h4 className="mb-3 text-primary">Welcome, {userInfo.name}</h4>
 
            <div className="row justify-content-center gap-4 mb-3">
              <div className="col bg-dark-subtle d-flex align-items-center justify-content-center p-1 rounded-4">
                <button className="btn btn-success btn-lg" onClick={() => navigate("/addTrip")}>+ <br/> Add Trip</button>
              </div>

              <div className="col bg-dark-subtle p-2 rounded-4" style={{minWidth: '12rem'}}>
                <AirQualityIndexChart airQualityIndex={airQualityIndex} />
                <h6 className="text-center mt-3 text-light">Current Air Quality Index</h6>
              </div>

              <div className="col bg-dark-subtle d-flex flex-column justify-content-between align-items-center py-3 rounded-4">
                <h1 className="text-secondary m-0">{userTotalGHGEmissions > 0 ? userTotalGHGEmissions.toFixed(4) : userTotalGHGEmissions}</h1>
                <h7 className="text-secondary m-0">MTCO2e</h7>
                <h6 className="text-center m-0 text-light">Total GHG Emissions</h6>
              </div>
            </div>

            
            <div className="row justify-content-center gap-4">
              <div className="col-lg overflow-y-auto bg-dark-subtle p-3 rounded-4">
                <h5 className="text-light">Recent Trips</h5>
                {usersTrips}
              </div>
              
              <div className="col-lg">
                <div className="row bg-dark-subtle p-3 mb-4 rounded-4">
                    <h5 className="text-light">Emissions History</h5>
                    <TripHistoryChart trips={trips} />
                </div>

                <div className="row bg-dark-subtle p-3 rounded-4">
                    <h5 className="text-light">Leaderboard</h5>
                    <LeaderboardChart leaderboardData={leaderboardData} />
                </div>
              </div>
            </div>
        </div>
    )
}