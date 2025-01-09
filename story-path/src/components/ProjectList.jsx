import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, deleteProject } from '../api';

function ProjectList() {
  const [projects, setProjects] = useState([]);

  // Fetch for information about projects in the list.
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);  
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []); 

  /**
   * Handle deletion of projects
   * Show a windows to make sure that users really want to delete their projects
  */
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id); // Use the API function
        setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    /**
     * Information for display including published, description and the project's title. 
     * A group of buttons including delete for delete project, edit to edit projects and View Location
     * View Location leads to the locations page for each projects. 
     */
    <div>
      <h1 className="mb-4">Projects</h1>
      {/* Button to add new projects into the projects list */}
      <Link to="/project/add" className="btn btn-primary mb-3">Add Project</Link>

      <ul className="list-group">
        {projects.map(project => (
          <li key={project.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div>
              <h3>
                {project.title} 
                <span className={`badge badge-status ${project.is_published ? 'bg-success' : 'bg-secondary'}`}>
                  {project.is_published ? 'Published' : 'Unpublished'}
                </span>
              </h3>
              </div>
              <p>{project.description}</p>
            </div>
            {/* Buttons group */}
            <div className="btn-group">
              <Link to={`/project/edit/${project.id}`} className="btn btn-outline-secondary">Edit</Link>
              <Link to={`/locations/${project.id}`} className="btn btn-outline-info">View Locations</Link>
              <button
                className="btn btn-outline-danger"
                onClick={() => handleDelete(project.id)}
              >Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectList;
