// frontend/src/components/ReviewForm.js

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Box,
  Typography,
  MenuItem,
  Rating,
  FormControl,
  InputLabel
} from '@mui/material';
import { reviewAPI, employeeAPI } from '../services/api';

const ReviewForm = ({ open, review, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    employee: '',
    review_period: '',
    rating: 3,
    feedback: '',
    review_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (open) {
      fetchEmployees();
      if (review) {
        setFormData({
          employee: review.employee || '',
          review_period: review.review_period || '',
          rating: review.rating || 3,
          feedback: review.feedback || '',
          review_date: review.review_date || ''
        });
      } else {
        setFormData({
          employee: '',
          review_period: '',
          rating: 3,
          feedback: '',
          review_date: new Date().toISOString().split('T')[0] // Today's date
        });
      }
      setError('');
    }
  }, [open, review]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getEmployees();
      setEmployees(response.data.results || response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({
      ...formData,
      rating: newValue
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (review) {
        await reviewAPI.updateReview(review.id, formData);
      } else {
        await reviewAPI.createReview(formData);
      }
      onSave();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.detail ||
                          JSON.stringify(err.response?.data) ||
                          'Failed to save review';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      employee: '',
      review_period: '',
      rating: 3,
      feedback: '',
      review_date: ''
    });
    setError('');
    onClose();
  };

  const getRatingLabel = (rating) => {
    const labels = {
      1: 'Poor',
      2: 'Below Average',
      3: 'Average',
      4: 'Good',
      5: 'Excellent'
    };
    return labels[rating] || 'Unknown';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {review ? 'Edit Performance Review' : 'Add New Performance Review'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                required
                fullWidth
                name="employee"
                label="Employee"
                value={formData.employee}
                onChange={handleChange}
                disabled={loading}
                helperText="Select the employee for this review"
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.full_name} - {employee.department}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="review_period"
                label="Review Period"
                value={formData.review_period}
                onChange={handleChange}
                disabled={loading}
                helperText="e.g., Q1 2024, H1 2024, Annual 2024"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="review_date"
                label="Review Date"
                type="date"
                value={formData.review_date}
                onChange={handleChange}
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box>
                <Typography component="legend" gutterBottom>
                  Rating *
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Rating
                    name="rating"
                    value={formData.rating}
                    onChange={handleRatingChange}
                    size="large"
                    disabled={loading}
                  />
                  <Typography variant="body1">
                    {formData.rating}/5 - {getRatingLabel(formData.rating)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="feedback"
                label="Feedback"
                value={formData.feedback}
                onChange={handleChange}
                disabled={loading}
                helperText="Optional feedback and comments about performance"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.employee || !formData.review_period || !formData.review_date}
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            review ? 'Update Review' : 'Add Review'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewForm;