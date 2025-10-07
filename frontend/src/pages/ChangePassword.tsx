import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../context/AuthContext';
import { updatePasswordValidationSchema } from '../utils/validation';

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: yupResolver(updatePasswordValidationSchema) as any,
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updatePassword(data.newPassword);
      setSuccess('Password updated successfully!');
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Change Password
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="New Password"
            type="password"
            autoComplete="new-password"
            {...register('newPassword')}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message || 'Password must be 8-16 characters with at least one uppercase letter and one special character'}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm New Password"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Update Password'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChangePassword;