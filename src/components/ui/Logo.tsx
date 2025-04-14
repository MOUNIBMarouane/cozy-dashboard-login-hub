
import React from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, iconOnly = false }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LayoutDashboard className="h-6 w-6 text-primary" />
      {!iconOnly && (
        <span className="font-bold text-xl">DashFlow</span>
      )}
    </div>
  );
};

export default Logo;
