import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const DashboardLayout = ({ title, subtitle, children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title={title} subtitle={subtitle} />
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
};
