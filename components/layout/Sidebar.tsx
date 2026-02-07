import { Button } from '../ui/button';
import { Home, Calendar, BookOpen, Wallet, Settings, LogOut, X } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = ({ activeView, onViewChange, onLogout, isMobileOpen, onMobileClose }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'guestBook', label: 'Guest Book', icon: BookOpen },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'settings', label: 'Data / Settings', icon: Settings }, // Added Settings
  ];

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-indigo-600">Guest Manager</h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMobileClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`
                    w-full justify-start gap-3
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => {
                    onViewChange(item.id);
                    onMobileClose();
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};