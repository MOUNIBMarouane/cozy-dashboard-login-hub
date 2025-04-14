
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/ui/Logo";
import { logout } from "@/lib/auth";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
  active,
}) => {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
          active && "bg-sidebar-accent text-sidebar-foreground font-medium"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const items = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/dashboard/analytics",
    },
    {
      icon: Users,
      label: "Users",
      href: "/dashboard/users",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/dashboard/settings",
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div
      className={cn(
        "flex flex-col transition-all duration-300 h-screen bg-sidebar sticky top-0 border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <div className={cn(collapsed && "hidden")}>
          <Logo />
        </div>
        <div className={cn(!collapsed && "hidden")}>
          <Logo iconOnly />
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {collapsed ? (
            <Menu className="h-5 w-5 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-sidebar-foreground" />
          )}
        </Button>
      </div>

      <Separator className="bg-sidebar-border" />

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location.pathname === item.href}
            />
          ))}
        </nav>
      </div>

      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className={cn(collapsed && "hidden")}>Log out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
