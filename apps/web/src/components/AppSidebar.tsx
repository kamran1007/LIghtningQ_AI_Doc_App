"use client";
import { Home, Activity, CalendarClock, MonitorSmartphone, Shuffle, Cloud, Sliders } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', icon: <Home />, path: '/dashboard' },
  { name: 'Queue Monitor', icon: <Activity />, path: '/profile' },
  { name: 'Appointments', icon: <CalendarClock />, path: '/appointments' },
  { name: 'Display Boards', icon: <MonitorSmartphone />, path: '/displays' },
  { name: 'Flow Optimization', icon: <Shuffle />, path: '/flow' },
  { name: 'Cloud Access', icon: <Cloud />, path: '/cloud' },
  { name: 'Settings', icon: <Sliders />, path: '/settings' },
];

export  function AppSidebar() {
  const [active, setActive] = useState('Dashboard');
  const [isHovered, setIsHovered] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  return (
    <aside
    className={`h-full bg-blue-900 text-white shadow-md flex flex-col transition-all duration-300 ${isHovered ? 'w-64' : 'w-20'}`}

    onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowUserInfo(false); // hide info when sidebar collapses
      }}
    >
      {/* <div className={`p-6 font-bold text-xl border-b border-blue-700 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
      </div> */}

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition 
              ${active === item.name ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
          >
            <span className="mr-3">{item.icon}</span>
            <span className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} whitespace-nowrap`}>
              {item.name}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
