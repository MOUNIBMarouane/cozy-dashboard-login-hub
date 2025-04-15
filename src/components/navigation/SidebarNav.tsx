
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, FileText, GitBranch } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarNav() {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 h-full bg-[#0a1033]/95 backdrop-blur-lg border-r border-blue-900/30 overflow-y-auto">
      <div className="px-4 py-2">
        <p className="text-xs font-medium text-blue-400/80 px-2 py-2">MAIN NAVIGATION</p>
        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <Link 
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-blue-600/40 text-blue-200' 
                  : 'text-blue-100 hover:bg-blue-800/30 hover:text-blue-50'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          
          {/* Documents */}
          <li>
            <Link 
              to="/documents"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/documents') 
                  ? 'bg-blue-600/40 text-blue-200' 
                  : 'text-blue-100 hover:bg-blue-800/30 hover:text-blue-50'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Documents</span>
            </Link>
          </li>
          
          {/* Circuits */}
          <li>
            <Link 
              to="/circuits"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/circuits') 
                  ? 'bg-blue-600/40 text-blue-200' 
                  : 'text-blue-100 hover:bg-blue-800/30 hover:text-blue-50'
              }`}
            >
              <GitBranch className="h-5 w-5" />
              <span>Circuits</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
