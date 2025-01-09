import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';  
import heroImage from './images/hero.png';

function Home() {
  return (
    <div className="container">
      <div className="row align-items-center mt-5">
        <div className="col-md-6">
          {/* Title with custom class */}
          <h1 className="custom-heading mb-3">Welcome to StoryPath</h1>
          
          {/* Paragraph with custom class */}
          <p className="custom-paragraph">Create engaging tours, hunts, and adventures!</p>

          {/* List with custom class */}
          <ul className="list-unstyled custom-list">
            <li>• Museum Tours</li>
            <li>• Campus Tours</li>
            <li>• Treasure Hunts</li>
            <li>• And more!</li>
          </ul>

          {/* CTA Button */}
          <Link to="/projects" className="btn btn-primary btn-lg mt-4">
            Get Started
          </Link>
        </div>

        {/* Image Section */}
        <div className="col-md-6">
          <img 
            src={heroImage} 
            alt="Tours and Adventures" 
            className="img-fluid rounded"
            style={{ maxHeight: '400px' }} 
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
