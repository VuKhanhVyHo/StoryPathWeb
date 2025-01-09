import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import QRCode from "react-qr-code";
import { getLocationsByProjectId, deleteLocationById } from '../api';

function LocationList() {
  const { id } = useParams(); 
  const [locations, setLocations] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocationsByProjectId(id);
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
  
    if (id) {
      fetchLocations();
    }
  }, [id]);

  const handleDelete = async (locationId) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await deleteLocationById(locationId); // Use the centralized API function
        setLocations(prevLocations => prevLocations.filter(location => location.id !== locationId));
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  /**
   * Generate the qr code using the name of locations
   * @param {String} locationName 
   */
  const printQR = (locationName) => {
    setQrCodes([locationName]); // Set QR code value to the location's name
  };

  /**
   * Method print all QR. If there is no location to print then show the alert
   */
  const printAllQR = () => {
    if (locations.length !== 0){
      const allQrCodes = locations.map(location => location.location_name); // Use location_name for all QR codes
      setQrCodes(allQrCodes);
    } else {
      alert("There is no location to print.");
    }
  };

  /**
   * List of locations, fetch using project_id to only show locations of the corresponding projects.
   * Each location shows information about trigger, positions and points.
   */
  return (
    <div>
      <h1 className="mb-4">Locations</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          {/* A button to add new locations to the project */}
          <Link to={`/location/add/${id}`} className="btn btn-primary">Add Location</Link>
        </div>
        <div className="btn-group">
          {/* Button to print all QR code */}
          <button className="btn btn-warning" onClick={printAllQR}>
            Print QR Codes for All
          </button>
          {/* Button leads to the preview site */}
          <Link to={`/preview/${id}`} className="btn btn-success">Preview</Link>
        </div>
      </div>
      <ul className="list-group">
        {locations.map(location => (
          <li key={location.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{location.location_name}</h5>
              <p>Trigger: {location.location_trigger}</p>
              <p>Position: {location.location_position}</p>
              <p>Points: {location.score_points}</p>
            </div>
            {/* Group of buttons, including delete location from the list or Print QR code of each location */}
            <div className="btn-group">
              <Link to={`/location/edit/${location.id}`} className="btn btn-outline-secondary">Edit</Link>
              <button
                className="btn btn-outline-danger"
                onClick={() => handleDelete(location.id)}
              >Delete</button>
              <button
                className="btn btn-outline-warning"
                onClick={() => printQR(location.location_name)} 
              >Print QR Code</button>
            </div>
          </li>
        ))}
      </ul>
      {/* Shows the QR code with name of the location belows them */}
      {qrCodes.length > 0 && (
        <div id="qr-container" className="mt-4">
          <h4>QR Codes for Locations</h4>
          <div className="d-flex flex-wrap">
            {qrCodes.map((qrCodeValue, index) => (
              <div key={index} className="m-2">
                <QRCode value={qrCodeValue} /> {/* Use location_name as the QR code value */}
                <p>{qrCodeValue}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationList;
