import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layoutcomponents/Header';
import Home from './components/Home';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import LocationList from './components/LocationList';
import LocationForm from './components/LocationForm';
import Footer from './components/layoutcomponents/Footer';
import Preview from './components/Preview';

function App() {
  const navLinks = [{ path: '/projects', text: 'PROJECTS' }];

  return (
    <Router>
      {/* Flex container with full-height setup */}
      <div className="d-flex flex-column min-vh-100">
        <Header brandText="STORYPATH" navLinks={navLinks} />

        {/* Main content area that will expand */}
        <div className="container mt-5 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/project/add" element={<ProjectForm isEdit={false} />} />
            <Route path="/project/edit/:id" element={<ProjectForm isEdit={true} />} />
            <Route path="/locations/:id" element={<LocationList />} />
            <Route path="/location/add/:id" element={<LocationForm isEdit={false} />} />
            <Route path="/location/edit/:id" element={<LocationForm isEdit={true} />} />
            <Route path="/preview/:id" element={<Preview />} />
          </Routes>
        </div>

        {/* Sticky Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
