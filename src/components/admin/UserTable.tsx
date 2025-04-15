import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import adminService, { UserDto } from '@/services/adminService';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';
import { UserTableHeader } from './table/UserTableHeader';
import { UserTableRow } from './table/UserTableRow';
import { UserTableEmpty } from './table/UserTableEmpty';
import { BulkActionsBar } from './table/BulkActionsBar';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { EditUserDialog } from './EditUserDialog';
import { EditUserEmailDialog } from './EditUserEmailDialog';
import { ViewUserLogsDialog } from './ViewUserLogsDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function UserTable() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [editEmailUser, setEditEmailUser] = useState<UserDto | null>(null);
  const [viewingUserLogs, setViewingUserLogs] = useState<number | null>(null);
  const [deletingUser, setDeletingUser] = useState<number | null>(null);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleChangeOpen, setRoleChangeOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const { data: users, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminService.getAllUsers,
  });

  const handleUserEdited = () => {
    refetch();
    setEditingUser(null);
  };

  const handleUserEmailEdited = () => {
    refetch();
    setEditEmailUser(null);
  };

  const handleUserDeleted = () => {
    refetch();
    setDeletingUser(null);
    setSelectedUsers([]);
  };

  const handleMultipleDeleted = () => {
    refetch();
    setSelectedUsers([]);
    setDeleteMultipleOpen(false);
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map(user => user.id) || []);
    }
  };

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await adminService.updateUser(userId, { 
        isActive: newStatus 
      });
      
      toast.success(`User ${newStatus ? 'activated' : 'blocked'} successfully`);
      refetch();
    } catch (error) {
      toast.error(`Failed to ${currentStatus ? 'block' : 'activate'} user`);
      console.error(error);
    }
  };

  const handleUserRoleChange = async (userId: number, roleName: string) => {
    try {
      await adminService.updateUser(userId, { 
        roleName
      });
      toast.success(`User role changed to ${roleName}`);
      refetch();
    } catch (error) {
      toast.error('Failed to change user role');
      console.error(error);
    }
  };

  const handleBulkRoleChange = async () => {
    if (!selectedRole || selectedUsers.length === 0) {
      toast.error('Please select a role and at least one user');
      return;
    }

    try {
      const updatePromises = selectedUsers.map(userId => 
        adminService.updateUser(userId, { roleName: selectedRole })
      );
      
      await Promise.all(updatePromises);
      toast.success(`Role updated to ${selectedRole} for ${selectedUsers.length} users`);
      refetch();
      setRoleChangeOpen(false);
      setSelectedRole('');
    } catch (error) {
      toast.error('Failed to update roles for selected users');
      console.error(error);
    }
  };

  const filteredUsers = users?.filter(user => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (isError) {
    return <div className="text-red-500 py-10 text-center">
      <AlertTriangle className="h-10 w-10 mx-auto mb-2" />
      Error loading users. Please try again.
    </div>;
  }

  return (
    <div>
      <UserTableHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="rounded-md border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#0d1424]">
              <TableRow className="border-gray-700 hover:bg-transparent">
                <TableHead className="w-12 text-gray-300">
                  <Checkbox 
                    checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers?.length}
                    onCheckedChange={handleSelectAll}
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
              {filteredUsers?.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isSelected={selectedUsers.includes(user.id)}
                  onSelect={handleSelectUser}
                  onToggleStatus={handleToggleUserStatus}
                  onRoleChange={handleUserRoleChange}
                  onEdit={setEditingUser}
                  onEditEmail={setEditEmailUser}
                  onViewLogs={setViewingUserLogs}
                  onDelete={setDeletingUser}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredUsers?.length === 0 && <UserTableEmpty />}
      </div>

      {selectedUsers.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedUsers.length}
          onChangeRole={() => setRoleChangeOpen(true)}
          onDelete={() => setDeleteMultipleOpen(true)}
        />
      )}

      {editingUser && (
        <EditUserDialog 
          user={editingUser} 
          open={!!editingUser} 
          onOpenChange={(open) => !open && setEditingUser(null)}
          onSuccess={handleUserEdited}
        />
      )}

      {editEmailUser && (
        <EditUserEmailDialog 
          user={editEmailUser}
          open={!!editEmailUser}
          onOpenChange={(open) => !open && setEditEmailUser(null)}
          onSuccess={handleUserEmailEdited}
        />
      )}

      {viewingUserLogs !== null && (
        <ViewUserLogsDialog
          userId={viewingUserLogs}
          open={viewingUserLogs !== null}
          onOpenChange={(open) => !open && setViewingUserLogs(null)}
        />
      )}

      {deletingUser !== null && (
        <DeleteConfirmDialog
          title="Delete User"
          description="Are you sure you want to delete this user? This action cannot be undone."
          open={deletingUser !== null}
          onOpenChange={(open) => !open && setDeletingUser(null)}
          onConfirm={async () => {
            try {
              if (deletingUser) {
                await adminService.deleteUser(deletingUser);
                toast.success('User deleted successfully');
                handleUserDeleted();
              }
            } catch (error) {
              toast.error('Failed to delete user');
              console.error(error);
            }
          }}
        />
      )}

      {deleteMultipleOpen && (
        <DeleteConfirmDialog
          title="Delete Multiple Users"
          description={`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`}
          open={deleteMultipleOpen}
          onOpenChange={setDeleteMultipleOpen}
          onConfirm={async () => {
            try {
              await adminService.deleteMultipleUsers(selectedUsers);
              toast.success(`${selectedUsers.length} users deleted successfully`);
              handleMultipleDeleted();
            } catch (error) {
              toast.error('Failed to delete users');
              console.error(error);
            }
          }}
        />
      )}

      {roleChangeOpen && (
        <DeleteConfirmDialog
          title="Change Role for Selected Users"
          description={`Select the role to assign to ${selectedUsers.length} users:`}
          open={roleChangeOpen}
          onOpenChange={setRoleChangeOpen}
          onConfirm={handleBulkRoleChange}
          confirmText="Change Role"
          cancelText="Cancel"
          destructive={false}
        >
          <div className="py-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full bg-[#0a1033] border-blue-900/30 text-white">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a1033] border-blue-900/30">
                {getAllRoles().map(role => (
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
          </div>
        </DeleteConfirmDialog>
      )}
    </div>
  );
}

function getAllRoles(): string[] {
  return ["Admin", "FullUser", "SimpleUser"];
}
