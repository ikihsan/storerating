import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,

  Rating as MuiRating,
  IconButton,
} from '@mui/material';
import { 
  Add, 
  Store as StoreIcon, 
  Visibility, 
  Edit,
  Search,
  Refresh 
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { adminAPI } from '../services/api';
import { createStoreValidationSchema } from '../utils/validation';
import { Store, Rating as RatingType, CreateStoreData, FilterParams } from '../types';

interface StoreFormData extends CreateStoreData {}

const AdminStores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [filters, setFilters] = useState<FilterParams>({});
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeRatings, setStoreRatings] = useState<RatingType[]>([]);
  const [viewRatingsDialog, setViewRatingsDialog] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: yupResolver(createStoreValidationSchema) as any,
  });

  const loadStores = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await adminAPI.getStores(filters);
      setStores(Array.isArray(data) ? data : []);
    } catch (err: any) {
      
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view stores.');
      } else {
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to load stores. Please check your connection and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const handleCreateStore = async (data: StoreFormData) => {
    try {
      setError('');
      await adminAPI.createStore(data);
      setSuccess('Store created successfully!');
      setOpenCreateDialog(false);
      reset();
      loadStores();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to create store. Please try again.'
      );
    }
  };

  const handleViewRatings = async (store: Store) => {
    try {
      setSelectedStore(store);
      setLoading(true);
      const ratings = await adminAPI.getStoreRatings(store.id);
      setStoreRatings(ratings);
      setViewRatingsDialog(true);
    } catch (err: any) {
      setError('Failed to load store ratings');
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

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Store Management
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

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters & Search
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Store Name"
              value={(filters as any).search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              sx={{ minWidth: 200 }}
              InputProps={{
                startAdornment: <Search />,
              }}
            />
            <TextField
              label="Location"
              value={(filters as any).location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadStores}
            >
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Stores Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : stores.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <StoreIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No stores found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Get started by creating the first store
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
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Store Name</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Total Ratings</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <StoreIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle2">
                          {store.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {store.owner ? (
                      <Box>
                        <Typography variant="body2">
                          {store.owner.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {store.owner.email}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No owner assigned
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{store.email}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {store.address}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <MuiRating value={store.averageRating || 0} readOnly size="small" />
                      <Typography variant="body2">
                        {store.averageRating?.toFixed(1) || '0.0'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={store.totalRatings || 0} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(store.createdAt || '').toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewRatings(store)}
                        title="View Ratings"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        title="Edit Store"
                      >
                        <Edit />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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

      {/* View Ratings Dialog */}
      <Dialog
        open={viewRatingsDialog}
        onClose={() => setViewRatingsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Ratings for {selectedStore?.name}
        </DialogTitle>
        <DialogContent>
          {storeRatings.length === 0 ? (
            <Typography variant="body2" color="textSecondary" py={4} textAlign="center">
              No ratings yet for this store
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {storeRatings.map((rating) => (
                    <TableRow key={rating.id}>
                      <TableCell>
                        {rating.user ? (
                          <Box>
                            <Typography variant="body2">
                              {rating.user.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {rating.user.email}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Unknown user
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <MuiRating value={rating.value} readOnly size="small" />
                          <Typography variant="body2">
                            {rating.value}/5
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewRatingsDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminStores;