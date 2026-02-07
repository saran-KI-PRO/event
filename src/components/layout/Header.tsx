import { Button } from "../ui/button";
import { LogOut, Leaf } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and App Name */}
        <div className="flex items-center gap-3">
          {/* Company Logo Placeholder */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
            {/* Replace this <div> with <img src="/your-logo.png" alt="Logo" className="h-full w-full object-contain" /> */}
            <Leaf className="h-6 w-6" />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-indigo-900 tracking-tight">
              LEED MANAGER
            </h1>
            {title && (
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                {title}
              </span>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout}
          className="text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}