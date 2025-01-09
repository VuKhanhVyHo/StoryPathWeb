import React from 'react';
import "../style.css"

function Footer() {
  return (
    <footer className="my footer">
      <p>&copy; {new Date().getFullYear()} StoryPath. All rights reseve</p>
    </footer>
  );
}

export default Footer;
