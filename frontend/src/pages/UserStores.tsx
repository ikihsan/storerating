import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Rating,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { Search, Star, LocationOn, Email } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { storeAPI, ratingAPI } from '../services/api';
import { ratingValidationSchema } from '../utils/validation';
import { Store, FilterParams } from '../types';

interface RatingFormData {
  rating: number;
}

const UserStores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [filters, setFilters] = useState<FilterParams>({});
  const [ratingDialog, setRatingDialog] = useState<{open: boolean, store: Store | null}>({
    open: false,
    store: null
  });

  // Debug: Check authentication
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    console.log('Auth check - Token exists:', !!token);
    console.log('Auth check - User exists:', !!user);
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('Auth check - User role:', parsedUser.role);
      } catch (e) {
        console.error('Auth check - Failed to parse user:', e);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RatingFormData>({
    resolver: yupResolver(ratingValidationSchema) as any,
  });

  useEffect(() => {
    loadStores();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStores = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading stores with filters:', filters);
      
      // Check if user is authenticated
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please log in to view stores.');
        return;
      }
      
      const data = await storeAPI.getStores(filters);
      console.log('Stores loaded:', data);
      setStores(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error loading stores:', err);
      
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
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleRatingSubmit = async (data: RatingFormData) => {
    if (!ratingDialog.store) return;

    try {
      setError('');
      setLoading(true);
      
      const ratingValue = Number(data.rating);
      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        setError('Please select a valid rating between 1 and 5');
        return;
      }

      if (ratingDialog.store.userRating) {
        await ratingAPI.updateRating(ratingDialog.store.id, ratingValue);
        setSuccess('Rating updated successfully!');
      } else {
        await ratingAPI.submitRating(ratingDialog.store.id, ratingValue);
        setSuccess('Rating submitted successfully!');
      }
      
      setRatingDialog({ open: false, store: null });
      reset();
      await loadStores(); // Refresh to show updated rating
    } catch (err: any) {
      console.error('Rating submission error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to submit rating. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const openRatingDialog = (store: Store) => {
    setRatingDialog({ open: true, store });
    reset({ rating: store.userRating || 1 });
    setError('');
    setSuccess('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Browse Stores
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

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Search />
            <Typography variant="h6">Search Stores</Typography>
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Store Name"
              variant="outlined"
              size="small"
              value={filters.name || ''}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              sx={{ minWidth: 250 }}
            />
            <TextField
              label="Address"
              variant="outlined"
              size="small"
              value={filters.address || ''}
              onChange={(e) => handleFilterChange('address', e.target.value)}
              sx={{ minWidth: 250 }}
            />
            <Button
              variant="outlined"
              onClick={() => setFilters({})}
            >
              Clear Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Stores Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : stores.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="textSecondary" py={4}>
          No stores found
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {stores.map((store) => (
            <Card key={store.id} sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h5" component="h2">
                    {store.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating value={store.averageRating || 0} readOnly precision={0.1} />
                    <Typography variant="body2" color="textSecondary">
                      ({store.totalRatings} rating{store.totalRatings !== 1 ? 's' : ''})
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary">
                    {store.email}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary">
                    {store.address}
                  </Typography>
                </Box>

                {store.userRating && (
                  <Box mb={2}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Your Rating:
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating value={store.userRating} readOnly />
                      <Chip 
                        label={`${store.userRating}/5`} 
                        color="primary" 
                        size="small" 
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>

              <CardActions>
                <Button
                  variant={store.userRating ? "outlined" : "contained"}
                  startIcon={<Star />}
                  onClick={() => openRatingDialog(store)}
                >
                  {store.userRating ? 'Update Rating' : 'Rate Store'}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {/* Rating Dialog */}
      <Dialog
        open={ratingDialog.open}
        onClose={() => setRatingDialog({ open: false, store: null })}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(handleRatingSubmit)}>
          <DialogTitle>
            {ratingDialog.store?.userRating ? 'Update Rating' : 'Rate Store'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              {ratingDialog.store?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              How would you rate this store? (1-5 stars)
            </Typography>
            
            <FormControl fullWidth error={!!errors.rating}>
              <InputLabel>Rating</InputLabel>
              <Select
                label="Rating"
                defaultValue={ratingDialog.store?.userRating || 1}
                {...register('rating', { valueAsNumber: true })}
              >
                <MenuItem value={1}>1 Star - Poor</MenuItem>
                <MenuItem value={2}>2 Stars - Fair</MenuItem>
                <MenuItem value={3}>3 Stars - Good</MenuItem>
                <MenuItem value={4}>4 Stars - Very Good</MenuItem>
                <MenuItem value={5}>5 Stars - Excellent</MenuItem>
              </Select>
              {errors.rating && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.rating.message}
                </Typography>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRatingDialog({ open: false, store: null })}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {ratingDialog.store?.userRating ? 'Update' : 'Submit'} Rating
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserStores;