import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from "react-qr-code";
import { getProject, getLocationsByProjectId } from '../api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';  

function Preview() {
  const { id } = useParams(); 
  const [project, setProject] = useState(null); 
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [points, setPoints] = useState(0);
  const [locationsVisited, setLocationsVisited] = useState(0);
  const [visitedLocations, setVisitedLocations] = useState([]); // To track visited locations
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [maxScore, setMaxScore] = useState(0); // New state for max score

  // Fetch project and location data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await getProject(id);
        const locationData = await getLocationsByProjectId(id);

        if (projectData) {
          setProject(projectData[0]);
        } else {
          console.error("No project found with the given ID.");
        }

        if (locationData) {
          setLocations(locationData);

          // Calculate the max score based on the sum of all location scores
          const totalScore = locationData.reduce((sum, location) => sum + location.score_points, 0);
          setMaxScore(totalScore);
        } else {
          console.error("No locations found for the project.");
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching project or locations:', error);
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProjects();
    }
  }, [id]);

  /**
   * If there is any locations of the project, the map will show the first location, otherwise it's set to the UQ's location
   */
  const firstLocation = locations.length > 0
    ? locations[0].location_position.slice(1, -1).split(',').map(coord => parseFloat(coord.trim()))
    : [-27.4975, 153.0137];


  /**
   * This method handle the change in locations. 
   * If select the Homescreen, then no changes in the visited locations and points
   * Otherwise it check and increase
   * @param {String} event 
   */
  const handleLocationChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "Homescreen") {
      setSelectedLocation(null); 
    } else {
      const selectedLoc = locations.find(loc => loc.location_name === selectedValue);
      if (selectedLoc) {
        setSelectedLocation(selectedLoc); 
        /**
         * Check if the location is visited, if yes then do nothing
         * Otherwise the method increase the total points and add location into the visited list
         */
        if (!visitedLocations.includes(selectedLoc.id)) {
          setVisitedLocations([...visitedLocations, selectedLoc.id]); // Add the location ID to visited
          setLocationsVisited((prevCount) => prevCount + 1); // Increment locations visited count
          const newPoints = points + selectedLoc.score_points;
          setPoints((prevPoints) => Math.min(newPoints, maxScore)); // Cap the score at the max score
        }
      }
    }
  };

  /**
   * This function aim to manage the state when users click on the marker
   * If users click on the marker of location they want to go
   * @param {Object} location 
   */
  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    if (!visitedLocations.includes(location.id)) {
      setVisitedLocations([...visitedLocations, location.id]); // Add the location ID to visited
      setLocationsVisited((prevCount) => prevCount + 1); // Increment locations visited count
      const newPoints = points + location.score_points;
      setPoints((prevPoints) => Math.min(newPoints, maxScore)); // Cap the score at the max score
    }
  };

  /**
   * These two are to handle errors
   */
  if (loading) {
    return <p>Loading project...</p>;
  }

  if (!project) {
    return <p>No project found.</p>;
  }

  /**
   * The preview site of the webpage. If the project has no locations, only show the homescreen with the map center in UQ 
   * It includes a dropdown menu that lets users easily switch between different locations
   */
  return (
    <div>
      <h1 className="mb-3" >{project.title} - Preview</h1>
      <p>Change locations to test scoring</p>
      <div className="mt-3">
        <select 
          onChange={handleLocationChange} 
          value={selectedLocation ? selectedLocation.location_name : "Homescreen"} // Controlled value
          className="form-select"
        >
          <option value="Homescreen">Homescreen</option>
          {locations.map((location, index) => (
            <option key={index} value={location.location_name}>{location.location_name}</option>
          ))}
        </select>
      </div>
      <div className="preview-container">
        {selectedLocation === null ? (
          <div>
            <div className='nb-container'>
              <div className="name-box">
                {project.title}
              </div>
            </div>
            {/* 
              The Homescreen needs to display a header with the Project title, project.instructions, 
              the project.initial_clue if project.homescreen_display is set to "Display initial clue" 
              or display all locations if "Display all locations" is selected. 
            */}
            <div className= "homescreen-information">
              <h3>Instructions</h3>
              <p>{project.instructions}</p>
              {project.homescreen_display === "Display initial clue" ? (
                <div> 
                  <h3>Initial Clue</h3>
                  <p>{project.initial_clue}</p>
                </div>
              ):(
                <div> 
                  <h3>All Locations</h3>
                    {locations.map((location) => (
                      <li key={location.id}>{location.location_name}</li>
                    ))}
                </div>
               )
              }
            </div>

            {/* Toggle Map Button */}
            <button
              className="btn btn-primary mt-3"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>

            {/* Conditionally Render Map */}
            {showMap && (
              <div className="preview-container">
                <MapContainer 
                  center={firstLocation} // Set center to the first location
                  zoom={20} 
                  scrollWheelZoom={true} 
                  style={{ height: '350px', width: '100%', marginBottom: '20px' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {locations.map((location) => {
                    const [x, y] = location.location_position.slice(1, -1).split(',').map(coord => parseFloat(coord.trim()));
                    return (
                      <Marker 
                        key={location.id} 
                        position={[x, y]}
                        eventHandlers={{
                          mouseover: (e) => {
                            e.target.openPopup(); // Show popup on hover
                          },
                          mouseout: (e) => {
                            e.target.closePopup(); // Close popup when the mouse leaves the marker
                          },
                          click: () => handleMarkerClick(location) // Handle click to go to the location
                        }}
                      >
                        <Popup>
                          <h5>{location.location_name}</h5>
                          <p><strong>Clue: </strong>{location.clue}</p>
                          <p><strong>Points: </strong>{location.score_points}</p>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            )}
          </div>
        ) : (
          /**
           * Following is the display of locations, show clue, content and a button to show QR code
           */
          <div>
            <div className='nb-container'>
              <div className="name-box">
                {selectedLocation.location_name}
              </div>
            </div>
            <div className= "homescreen-information">
              <h4>Clue:</h4> {selectedLocation.clue || 'No clue available'}
              <h4>Content:</h4>
              {/* this can show the content in the correct format */}
              <div className="location-content" dangerouslySetInnerHTML={{ __html: selectedLocation.location_content }} />
            </div>
            {/* Toggle QR Code Button */}
            <button
                  className="btn btn-primary mt-3"
                  onClick={() => setShowQR(!showQR)}
                >
                  {showQR ? 'Hide QR' : 'Show QR'}
            </button>
          </div>
        )}
        
        {selectedLocation && showQR ? (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <QRCode value={project.id+','+selectedLocation.id} />
          </div>
        ): (
          <div></div>
        )}
        {/* Visits and scores should be tracked within React and will be lost when the user leaves the Preview. */}
        <div className="score-container">
          <div className="score-box">
            <p>Points:</p>
            <p>{points} / {maxScore}</p> {/* Display the max score dynamically */}
          </div>
          <div className="score-box">
            <p>Locations Visited:</p>
            <p>{locationsVisited} / {locations.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;
