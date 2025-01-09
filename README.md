# Introduction
StoryPath is a location experience platform designed to allow users to create and explore virtual museum exhibits, location-based tours, and treasure hunts with clues.

# Library:
* react-qr-code
* react-quilljs
* react-leaflet.js

# Instructions
* run `npm install`
* run `npm run dev`
* click on the url show in terminal

# Components
* Home.jsx: Responsible for the main page with hero and overall information about the project
* LocationForm.jsx: Edit/Add form for the Locations of a projects
* LocationList.jsx: List of locations for that project.
* Preview.jsx: The Preview page that can simulate the app on mobile device. Homescreen page is implemented with an advance feature. On other locations pages display the location content including images and information formatted with the react-quilljs, after that is an QR code that represent for the locations. 
* ProjectForm.jsx: Edit/Add form for the projects
* ProjectList.jsx: List of projects. 

# Advance Feature
**Chosen Feature:** Add a map option for Homescreen display. This will display the location markers on a map on the Homescreen in the Preview.

**Technology:** react-leaflet.js

On HomeScreen display, there is a button, click on that button to show the map. 

This feature provides a map on the Homescreen display and markers that pinned locations of the project. When users hover on the marker, a popup shows details about the location including the location name, points that you may get and the clue of that location as well. When users click on the location, it will direct to the location page where users can see information about location content (parts that written in the location_content.)

If users want, they can click on hide map to hide the map.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


