import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { People, Store, Star, Add } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { adminAPI } from '../services/api';
import { createUserValidationSchema } from '../utils/validation';
import { DashboardStats, CreateUserData, UserRole } from '../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserData>({
    resolver: yupResolver(createUserValidationSchema) as any,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const statsData = await adminAPI.getDashboardStats();
      setStats(statsData);
    } catch (err: any) {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (data: CreateUserData) => {
    try {
      setError('');
      await adminAPI.createUser(data);
      setSuccess('User created successfully');
      setOpenUserDialog(false);
      reset();
      loadDashboardData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Stats Cards */}
      <Box display="flex" gap={3} sx={{ mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <People color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4">
                  {stats?.totalUsers || 0}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Store color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Stores
                </Typography>
                <Typography variant="h4">
                  {stats?.totalStores || 0}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Star color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Ratings
                </Typography>
                <Typography variant="h4">
                  {stats?.totalRatings || 0}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenUserDialog(true)}
          sx={{ mr: 2 }}
        >
          Add User
        </Button>
      </Box>

      {/* Create User Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(handleCreateUser)}>
          <DialogTitle>Create New User</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Full Name (20-60 characters)"
              fullWidth
              variant="outlined"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="dense"
              label="Address (Max 400 characters)"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                {...register('role')}
                error={!!errors.role}
              >
                <MenuItem value={UserRole.USER}>Normal User</MenuItem>
                <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
                <MenuItem value={UserRole.STORE_OWNER}>Store Owner</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;