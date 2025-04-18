import React from 'react';

function DashboardHeader({ location, date }) {
  return (
    <div className="header">
      <div className="location">{location}</div>
      <div className="date">{date}</div>
    </div>
  );
}

export default DashboardHeader;
