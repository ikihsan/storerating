import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  TableSortLabel,
} from '@mui/material';
import { Visibility, FilterList } from '@mui/icons-material';
import { adminAPI } from '../services/api';
import { User, UserRole, FilterParams } from '../types';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState<FilterParams>({});
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadUsers();
  }, [filters, sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getUsers({
        ...filters,
        sortBy,
        sortOrder,
      });
      setUsers(data);
    } catch (err: any) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'error';
      case UserRole.STORE_OWNER:
        return 'warning';
      case UserRole.USER:
        return 'success';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.STORE_OWNER:
        return 'Store Owner';
      case UserRole.USER:
        return 'User';
      default:
        return role;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <FilterList />
          <Typography variant="h6">
            Filters
          </Typography>
        </Box>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            value={filters.name || ''}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            value={filters.email || ''}
            onChange={(e) => handleFilterChange('email', e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Address"
            variant="outlined"
            size="small"
            value={filters.address || ''}
            onChange={(e) => handleFilterChange('address', e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={filters.role || ''}
              label="Role"
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value={UserRole.USER}>User</MenuItem>
              <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
              <MenuItem value={UserRole.STORE_OWNER}>Store Owner</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={() => {
              setFilters({});
              setSortBy('name');
              setSortOrder('asc');
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortBy === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'email'}
                  direction={sortBy === 'email' ? sortOrder : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'address'}
                  direction={sortBy === 'address' ? sortOrder : 'asc'}
                  onClick={() => handleSort('address')}
                >
                  Address
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'role'}
                  direction={sortBy === 'role' ? sortOrder : 'asc'}
                  onClick={() => handleSort('role')}
                >
                  Role
                </TableSortLabel>
              </TableCell>
              <TableCell>Store Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(user.role)}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.role === UserRole.STORE_OWNER && user.store ? (
                      <Typography variant="body2">
                        {user.store.averageRating?.toFixed(1) || 'No ratings'} ⭐
                      </Typography>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        // Navigate to user details
                        window.open(`/admin/users/${user.id}`, '_blank');
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminUsers;