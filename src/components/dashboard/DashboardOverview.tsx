import React from 'react';
import { ChartBarIcon, UsersIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const DashboardOverview: React.FC = () => {
  const stats = [
    {
      title: 'Total Bookings',
      value: '145',
      change: '+12.5%',
      icon: CalendarIcon,
      color: 'blue'
    },
    {
      title: 'Total Revenue',
      value: '$24,500',
      change: '+15.2%',
      icon: CurrencyDollarIcon,
      color: 'green'
    },
    {
      title: 'Active Users',
      value: '1,280',
      change: '+8.1%',
      icon: UsersIcon,
      color: 'purple'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+2.4%',
      icon: ChartBarIcon,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
                <span className={`text-sm font-medium text-${stat.color}-600 bg-${stat.color}-50/50 px-2.5 py-0.5 rounded-full`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New booking received</p>
                <p className="text-sm text-gray-500">John Doe booked Mountain Zen Retreat</p>
              </div>
              <span className="ml-auto text-sm text-gray-500">2 hours ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 