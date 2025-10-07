import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  Alert,
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Store, Star, Person, Add } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { storeAPI } from '../services/api';
import { createStoreValidationSchema } from '../utils/validation';
import { Store as StoreType, CreateStoreData } from '../types';

interface StoreFormData extends CreateStoreData {}

const StoreOwnerDashboard: React.FC = () => {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: yupResolver(createStoreValidationSchema) as any,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await storeAPI.getOwnerDashboard();
      setStores(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error loading store owner dashboard:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view this dashboard.');
      } else {
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to load dashboard data. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (data: StoreFormData) => {
    try {
      setError('');
      await storeAPI.createStore(data);
      setSuccess('Store created successfully!');
      setOpenCreateDialog(false);
      reset();
      loadDashboard();
    } catch (err: any) {
      console.error('Error creating store:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to create store. Please try again.'
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (stores.length === 0 && !loading) {
    return (
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Store Owner Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Create Your First Store
          </Button>
        </Box>

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

        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Store sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No stores yet
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Get started by creating your first store
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCreateDialog(true)}
            >
              Create Store
            </Button>
          </CardContent>
        </Card>

        {/* Create Store Dialog */}
        <Dialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={handleSubmit(handleCreateStore)}>
            <DialogTitle>Create Your Store</DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column" gap={2} pt={1}>
                <TextField
                  label="Store Name"
                  fullWidth
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                  label="Address"
                  multiline
                  rows={3}
                  fullWidth
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Create Store
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Store Owner Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Create Store
        </Button>
      </Box>

      {/* Error and Success Messages */}
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

      {stores.map((store) => (
        <Card key={store.id} sx={{ mb: 4 }}>
          <CardContent>
            {/* Store Header */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Store color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" component="h2">
                  {store.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {store.address}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {store.email}
                </Typography>
              </Box>
            </Box>

            {/* Store Stats */}
            <Box display="flex" gap={3} flexWrap="wrap" mb={4}>
              <Card variant="outlined" sx={{ p: 2, flex: '1 1 200px' }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Star color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Average Rating
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">
                        {store.averageRating?.toFixed(1) || '0.0'}
                      </Typography>
                      <Rating value={store.averageRating || 0} readOnly precision={0.1} size="small" />
                    </Box>
                  </Box>
                </Box>
              </Card>

              <Card variant="outlined" sx={{ p: 2, flex: '1 1 200px' }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Person color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Total Ratings
                    </Typography>
                    <Typography variant="h6">
                      {store.totalRatings || 0}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>

            {/* Users Who Rated */}
            <Typography variant="h6" gutterBottom>
              Customers Who Rated Your Store
            </Typography>

            {!store.usersWhoRated || store.usersWhoRated.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No customers have rated your store yet.
              </Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {store.usersWhoRated.map((userRating) => (
                      <TableRow key={`${userRating.id}-${userRating.rating}`}>
                        <TableCell>{userRating.name}</TableCell>
                        <TableCell>{userRating.email}</TableCell>
                        <TableCell>{userRating.address}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Rating value={userRating.rating} readOnly size="small" />
                            <Chip
                              label={`${userRating.rating}/5`}
                              color={
                                userRating.rating >= 4 ? 'success' :
                                userRating.rating >= 3 ? 'warning' : 'error'
                              }
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(userRating.ratedAt)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Create Store Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(handleCreateStore)}>
          <DialogTitle>Create New Store</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} pt={1}>
              <TextField
                label="Store Name"
                fullWidth
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Address"
                multiline
                rows={3}
                fullWidth
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create Store
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default StoreOwnerDashboard;