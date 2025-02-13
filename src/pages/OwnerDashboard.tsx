import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import { dashboardRoutes } from '@routes/dashboardRoutes';

const OwnerDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        {dashboardRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </DashboardLayout>
  );
};

export default OwnerDashboard; 