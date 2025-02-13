import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@lib/supabase";
import { 
  UsersIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
  PlusCircleIcon,
  ChartBarIcon,
  MapPinIcon,
  TagIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HomeIcon,
  ClockIcon,
  MapIcon
} from "@heroicons/react/24/outline";
import type { UserProfile } from "@types";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        navigate('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;
      setUser(profile);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/dashboard",
      icon: Squares2X2Icon,
      title: "Dashboard",
    },
    {
      path: "/dashboard/retreats",
      icon: MapPinIcon,
      title: "Retreats",
      submenu: [
        {
          path: "/dashboard/retreats/new",
          icon: PlusCircleIcon,
          title: "Add New Retreat",
        },
        {
          path: "/dashboard/retreats/list",
          icon: ChartBarIcon,
          title: "View All Retreats",
        },
      ],
    },
    {
      path: "/dashboard/analytics",
      icon: ChartBarIcon,
      title: "Analytics",
    },
    {
      path: "/dashboard/location",
      icon: MapIcon,
      title: "Locations",
    },
    {
      path: "/dashboard/retreat-types",
      icon: TagIcon,
      title: "Retreat Types",
    },
    {
      path: "/dashboard/settings",
      icon: Cog6ToothIcon,
      title: "Settings",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${
          isSidebarOpen ? "w-80" : "w-20"
        } bg-white shadow-xl transition-all duration-300 ease-in-out relative border-r border-gray-100`}
      >
        <div className="flex h-full flex-col">
          {/* Header Section */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600">
              {isSidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-white/20">
                    <span className="text-white font-bold text-2xl">R</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white text-lg tracking-wide">Retreat</span>
                    <span className="font-medium text-blue-100 text-sm tracking-wider">ADMIN PORTAL</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Bars3Icon className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-none">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.path} className="mb-2">
                  <Link
                    to={item.path}
                    onClick={() => {
                      if (item.submenu) {
                        setOpenSubmenu(openSubmenu === item.path ? null : item.path);
                      }
                    }}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-blue-50 via-blue-100/50 to-blue-50 text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                    }`}
                  >
                    <div className={`
                      ${location.pathname === item.path
                        ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-500"
                      } p-2.5 rounded-lg transition-all duration-200 mr-3 group-hover:shadow-md
                    `}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    {isSidebarOpen && (
                      <>
                        <span className="font-medium tracking-wide">{item.title}</span>
                        {item.submenu && (
                          <div className="ml-auto">
                            {openSubmenu === item.path ? (
                              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </Link>
                  {item.submenu && openSubmenu === item.path && isSidebarOpen && (
                    <div className="mt-2 ml-12 space-y-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                            location.pathname === subItem.path
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-500 hover:bg-gray-50/80 hover:text-gray-900"
                          }`}
                        >
                          <div className={`
                            w-2 h-2 rounded-full mr-3
                            ${location.pathname === subItem.path
                              ? "bg-blue-600 ring-4 ring-blue-100"
                              : "bg-gray-300"
                            }
                          `} />
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="flex-shrink-0 border-t border-gray-100">
            <div className="p-6 bg-gradient-to-b from-transparent via-gray-50/50 to-gray-50/80">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg ring-2 ring-blue-400/20">
                    <UsersIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>
                {isSidebarOpen && (
                  <div className="flex-1 min-w-0">
                    {loading ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-3 w-32 bg-gray-200 rounded"></div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email || 'No email'}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-white shadow-sm group-hover:bg-red-100 transition-colors ring-1 ring-gray-100 group-hover:ring-red-200">
                  <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:text-red-600" />
                </div>
                {isSidebarOpen && <span className="font-medium">Sign Out</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
} 