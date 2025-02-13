import React from 'react';
import { Route } from 'react-router-dom';
import AddEditRetreat from '@pages/AddEditRetreat';
import LocationManagement from '@pages/LocationManagement';
import RetreatTypeManager from '@components/dashboard/RetreatTypeManager';
import DashboardOverview from '@components/dashboard/DashboardOverview';
import RetreatList from '@components/dashboard/RetreatList';

export const dashboardRoutes = [
  { path: "/", element: <DashboardOverview /> },
  { path: "/retreats", element: <RetreatList /> },
  { path: "/retreats/new", element: <AddEditRetreat /> },
  { path: "/retreats/edit/:id", element: <AddEditRetreat /> },
  { path: "/location", element: <LocationManagement /> },
  { path: "/retreat-types", element: <RetreatTypeManager /> }
];

export const menuItems = [
  { path: '/dashboard', icon: 'Grid', title: 'Dashboard' },
  {
    path: '/dashboard/retreats',
    icon: 'PlusCircle',
    title: 'Retreats',
    submenu: [
      { path: '/dashboard/retreats', title: 'All Retreats' },
      { path: '/dashboard/retreats/new', title: 'Add Retreat' }
    ]
  },
  { path: '/dashboard/analytics', icon: 'BarChart', title: 'Analytics' },
  { path: '/dashboard/location', icon: 'Navigation', title: 'Location' },
  { path: '/dashboard/city', icon: 'Home', title: 'City' },
  { path: '/dashboard/duration', icon: 'Clock', title: 'Duration' },
  { path: '/dashboard/retreat-types', icon: 'Tag', title: 'Retreat Types' },
  { path: '/dashboard/settings', icon: 'Settings', title: 'Settings' }
]; 