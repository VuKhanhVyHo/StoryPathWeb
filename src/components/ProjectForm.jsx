import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProject, createProject, updateProject } from '../api';
import './style.css'

// isEdit is the param that can detect whether users are adding new projects or editing the existing projects
const ProjectForm = ({ isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    initialClue: '',
    homescreenDisplay: '',
    participantScoring: '',
    published: false,
  });

  const [initialFormData, setInitialFormData] = useState(null);  // To store initial data

  // Fetch project data when editing (isEdit === true)
  useEffect(() => {
    if (isEdit && id) {
      const fetchProjectData = async () => {
        try {
          const [data] = await getProject(id); // Use the getProject function from api.js
          const projectData = {
            title: data.title,
            description: data.description,
            instructions: data.instructions,
            initialClue: data.initial_clue,
            homescreenDisplay: data.homescreen_display,
            participantScoring: data.participant_scoring,
            published: data.is_published,
          };
          setFormData(projectData);
          setInitialFormData(projectData);  // Store initial data
        } catch (error) {
          console.error('Error fetching project:', error);
        }
      };

      fetchProjectData();
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /**
     * Check if the data is different from the initial data
     * If not then alert the user that there was no changes made, they should choose cancel if want to back or make the edit they want
     */
    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      alert('No changes made.');
      return;
    }

    const projectData = {
      title: formData.title,
      description: formData.description,
      instructions: formData.instructions,
      initial_clue: formData.initialClue,
      homescreen_display: formData.homescreenDisplay,
      is_published: formData.published,
      participant_scoring: formData.participantScoring,
      username: 's4759786',
    };

    try {
      if (isEdit) {
        await updateProject(id, projectData); // Use updateProject from api.js
        alert('Project updated successfully!');
      } else {
        await createProject(projectData); // Use createProject from api.js
        alert('Project added successfully!');
      }
      navigate('/projects');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  /**
   * A form to Add project or Edit existing projects. 
   * If the form is detected as edit form, it will fill the information that fetched from the database
   */
  return (
    <form onSubmit={handleSubmit}>
      {/* If isEdit then show an Edit form, otherwise show the Add form */}
      <h1>{isEdit ? "Edit" : "Add"} Project</h1>
      
      <div className="form-group">
        <div>
          <label>Title</label>
          <input
            className="form-control"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="The name of your project."
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a brief description of your project. This is not displayed to participants."
            required
          />
        </div>
        <div>
          <label>Instructions</label>
          <textarea
            className="form-control"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Instructions for participants, explaining how to engage with the project."
            required
          />
        </div>
        <div>
          <label>Initial Clue</label>
          <input
            className="form-control"
            type="text"
            name="initialClue"
            value={formData.initialClue}
            onChange={handleChange}
            placeholder="The first clue to start the project, This is optional"
          />
        </div>
        <div>
          <label>Homescreen Display</label>
          <select
            className="form-control"
            name="Choose what to display on the homescreen of the project."
            value={formData.homescreenDisplay}
            onChange={handleChange}
            required
          >
            <option value="Display initial clue">Display initial clue</option>
            <option value="Display all locations">Display all locations</option>
          </select>
        </div>
        <div>
          <label>Participant Scoring</label>
          <select
            className="form-control"
            name="participantScoring"
            value={formData.participantScoring}
            onChange={handleChange}
            required
          >
            <option value="Not Scored">Not Scored</option>
            <option value="Number of Scanned QR Codes">Number of Scanned QR Codes</option>
            <option value="Number of Locations Entered">Number of Locations Entered</option>
          </select>
        </div>
        <div>
          <input
            style={{ marginRight: "5px" }}
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
          />
          <label>Published</label>
        </div>
      </div>
      {/* If users choose to cancel, then back to the projects page */}
      <Link to={`/projects`} className="btn cancel btn-primary mt-4">Cancel</Link>
      {/* Submit the Add/Edit form */}
      <button type="submit" className="btn btn-primary mt-4">{isEdit ? 'Update' : 'Add'} Project</button>
    </form>
  );
};

export default ProjectForm;
