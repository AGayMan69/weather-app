// src/components/SidebarHeaderDisplay.jsx
import React from 'react';

function SidebarHeaderDisplay({ greeting, currentTime }) {
  return (
    <div className="sidebar-header">
      <div className="greeting">{greeting}</div>
      <div className="time">{currentTime}</div>
    </div>
  );
}

export default SidebarHeaderDisplay;
