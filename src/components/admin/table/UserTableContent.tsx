
import { UserDto } from '@/services/adminService';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { UserTableRow } from './UserTableRow';
import { UserTableEmpty } from './UserTableEmpty';

interface UserTableContentProps {
  users: UserDto[] | undefined;
  selectedUsers: number[];
  onSelectAll: () => void;
  onSelectUser: (userId: number) => void;
  onToggleStatus: (userId: number, currentStatus: boolean) => void;
  onRoleChange: (userId: number, roleName: string) => void;
  onEdit: (user: UserDto) => void;
  onEditEmail: (user: UserDto) => void;
  onViewLogs: (userId: number) => void;
  onDelete: (userId: number) => void;
}

export function UserTableContent({
  users,
  selectedUsers,
  onSelectAll,
  onSelectUser,
  onToggleStatus,
  onRoleChange,
  onEdit,
  onEditEmail,
  onViewLogs,
  onDelete,
}: UserTableContentProps) {
  return (
    <div className="rounded-md border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#0d1424]">
            <TableRow className="border-gray-700 hover:bg-transparent">
              <TableHead className="w-12 text-gray-300">
                <Checkbox 
                  checked={selectedUsers.length > 0 && selectedUsers.length === users?.length}
                  onCheckedChange={onSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Role</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Block</TableHead>
              <TableHead className="w-16 text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isSelected={selectedUsers.includes(user.id)}
                onSelect={onSelectUser}
                onToggleStatus={onToggleStatus}
                onRoleChange={onRoleChange}
                onEdit={onEdit}
                onEditEmail={onEditEmail}
                onViewLogs={onViewLogs}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      {users?.length === 0 && <UserTableEmpty />}
    </div>
  );
}
