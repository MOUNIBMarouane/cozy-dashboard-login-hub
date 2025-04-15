
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserDto } from "@/services/adminService";
import { Edit, Eye, Mail, MoreVertical, Trash } from "lucide-react";

interface UserTableRowProps {
  user: UserDto;
  isSelected: boolean;
  onSelect: (userId: number) => void;
  onToggleStatus: (userId: number, currentStatus: boolean) => void;
  onRoleChange: (userId: number, roleName: string) => void;
  onEdit: (user: UserDto) => void;
  onEditEmail: (user: UserDto) => void;
  onViewLogs: (userId: number) => void;
  onDelete: (userId: number) => void;
}

export function UserTableRow({
  user,
  isSelected,
  onSelect,
  onToggleStatus,
  onRoleChange,
  onEdit,
  onEditEmail,
  onViewLogs,
  onDelete
}: UserTableRowProps) {
  const currentRole = getRoleString(user.role);
  
  return (
    <TableRow 
      className={`border-gray-700 hover:bg-[#0d1424] transition-all ${
        isSelected ? 'bg-blue-900/20 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <TableCell>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelect(user.id)}
          aria-label={`Select user ${user.username}`}
        />
      </TableCell>
      <TableCell>
        <Avatar>
          <AvatarImage src={user.profilePicture} alt={user.username} />
          <AvatarFallback className="bg-blue-600">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium text-white">
        {user.firstName} {user.lastName}
        <div className="text-xs text-gray-400">@{user.username}</div>
      </TableCell>
      <TableCell className="text-gray-300 max-w-[180px] truncate">
        <span className="block truncate">{user.email}</span>
      </TableCell>
      <TableCell>
        <Select 
          value={currentRole}
          onValueChange={(value) => onRoleChange(user.id, value)}
        >
          <SelectTrigger className="w-[130px] bg-[#0a1033] border-blue-900/30 text-white">
            <SelectValue placeholder={currentRole} />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1033] border-blue-900/30 text-white">
            <SelectItem 
              key={currentRole} 
              value={currentRole} 
              className="text-blue-400 bg-blue-900/20 border-l-2 border-blue-500"
            >
              Current: {currentRole}
            </SelectItem>
            <SelectSeparator className="bg-blue-900/30" />
            {getAvailableRoles(currentRole).map(role => (
              <SelectItem 
                key={role} 
                value={role} 
                className="text-white hover:bg-blue-900/20"
              >
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        {user.isActive ? (
          <Badge variant="secondary" className="bg-green-900/20 text-green-400 hover:bg-green-900/30">Active</Badge>
        ) : (
          <Badge variant="destructive" className="bg-red-900/20 text-red-400 hover:bg-red-900/30">Inactive</Badge>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Switch
            checked={user.isActive}
            onCheckedChange={() => onToggleStatus(user.id, user.isActive)}
            className={user.isActive ? "bg-green-600" : "bg-red-600"}
          />
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#161b22] border-gray-700 text-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem onClick={() => onEdit(user)} className="hover:bg-gray-800">
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditEmail(user)} className="hover:bg-gray-800">
              <Mail className="mr-2 h-4 w-4" />
              Update Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewLogs(user.id)} className="hover:bg-gray-800">
              <Eye className="mr-2 h-4 w-4" />
              View Logs
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              className="text-red-400 hover:bg-red-900/20 hover:text-red-300" 
              onClick={() => onDelete(user.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function getRoleString(role: string | { roleId?: number; roleName?: string }): string {
  if (typeof role === 'string') {
    return role;
  }
  
  if (role && typeof role === 'object' && 'roleName' in role) {
    return role.roleName || 'Unknown';
  }
  
  return 'Unknown';
}

function getAvailableRoles(currentRole: string): string[] {
  const allRoles = ["Admin", "FullUser", "SimpleUser"];
  return allRoles.filter(role => role !== currentRole);
}
