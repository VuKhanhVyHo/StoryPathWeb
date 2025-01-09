import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { getLocationById, createLocation, updateLocation } from '../api';
import './style.css';

/**
 * THe location Form to add or edit base on the param
 */
const LocationForm = ({ isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  /**
   * Initialize Quill using useQuill hook
   * Functionality including Bold, Italic, changing fonts, colours and background colours), 
   * headings (e.g. H1), links, images (inserted via Base64)
   */
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        ['bold', 'italic', 'underline'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['link', 'image'],
        ['clean'],
      ],
    },
  });

  const [formData, setFormData] = useState({
    locationName: '',
    locationTrigger: 'Location Entry',
    locationPosition: '',
    scorePoints: 0,
    clue: '',
    locationContent: '',
    project_id: '',
  });

  const [initialFormData, setInitialFormData] = useState(null); // For storing initial form data

  // Fetch data in edit mode and store it as initial data
  useEffect(() => {
    if (isEdit && id) {
      const fetchLocationData = async () => {
        try {
          const [data] = await getLocationById(id);
          const fetchedData = {
            projectId: data.project_id,
            locationName: data.location_name,
            locationTrigger: data.location_trigger,
            locationPosition: data.location_position,
            scorePoints: data.score_points || 0,
            clue: data.clue || '',
            locationContent: data.location_content || '',
            project_id: data.project_id || '',
          };

          setFormData(fetchedData);
          setInitialFormData(fetchedData); // Set initial form data

          // This to ensure that the retrieve information about content is in the correct format
          if (quill) {
            quill.clipboard.dangerouslyPasteHTML(data.location_content || '');
          }
        } catch (error) {
          console.error('Error fetching location:', error);
        }
      };
      fetchLocationData();
    }
  }, [isEdit, id, quill]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  // Handle Quill editor content changes
  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setFormData((prev) => ({
          ...prev,
          locationContent: quill.root.innerHTML,
        }));
      });
    }
  }, [quill]);


  // This method to ensure that if changes are made then throw alert.
  const checkForChanges = () => {
    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      alert('No changes were made.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkForChanges()) {
      return;
    }

    const locationData = {
      project_id: isEdit ? formData.project_id : id,
      location_name: formData.locationName,
      location_trigger: formData.locationTrigger,
      location_position: formData.locationPosition,
      score_points: formData.scorePoints,
      clue: formData.clue,
      location_content: formData.locationContent,
      username: 's4759786',
    };

    try {
      if (isEdit) {
        await updateLocation(id, locationData);
        alert('Location updated successfully!');
      } else {
        await createLocation(locationData);
        alert('Location added successfully!');
      }
      navigate(`/locations/${isEdit ? formData.project_id : id}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  /**
   * This form is for adding new locations or edit the existing one, rely on the isEdit param
   */
  return (
    <form onSubmit={handleSubmit}>
      <h1 className="mb-4">{isEdit ? 'Edit Location' : 'Add Location'}</h1>
      <div className="form-group">
        {/* Location Name */}
        <div>
          <label>Location Name</label>
          <input
            type="text"
            className="form-control"
            name="locationName"
            value={formData.locationName}
            onChange={handleChange}
            placeholder="The name of this location"
            required
          />
        </div>

        {/* Location Trigger */}
        <div>
          <label>Location Trigger</label>
          <select
            className="form-control"
            name="locationTrigger"
            value={formData.locationTrigger}
            onChange={handleChange}
          >
            <option value="Location Entry">Location Entry</option>
            <option value="QR Code Scan">QR Code Scan</option>
            <option value="Both Location Entry and QR Code Scan">Both Location Entry and QR Code Scan</option>
          </select>
        </div>

        {/* Location Position */}
        <div>
          <label>Location Position (lat, long)</label>
          <input
            type="text"
            className="form-control"
            name="locationPosition"
            value={formData.locationPosition}
            onChange={handleChange}
            placeholder="Enter the latitude and longitude for this location"
            required
          />
        </div>

        {/* Score Points */}
        <div>
          <label>Points for Reaching Location</label>
          <input
            type="number"
            className="form-control"
            name="scorePoints"
            value={formData.scorePoints}
            onChange={handleChange}
            placeholder="Specify the number of points participants earn by reaching this location"
            required
          />
        </div>

        {/* Clue */}
        <div>
          <label>Clue (Optional)</label>
          <textarea
            className="form-control"
            name="clue"
            value={formData.clue}
            onChange={handleChange}
            placeholder="Enter the clue that leads to the next location"
            rows="3"
          />
        </div>

        {/* Location Content (Quill Editor) */}
        <div>
          <label>Location Content</label>
          <div ref={quillRef} style={{ height: '300px' }} /> 
        </div>
      </div>
      <Link to={`/locations/${isEdit ? formData.project_id : id}`} className="btn cancel btn-primary mt-4">Cancel</Link>
      <button type="submit" className="btn btn-primary mt-4">{isEdit ? 'Update' : 'Add'} Location</button>
    </form>
  );
};

export default LocationForm;
