// frontend/src/components/ReviewManagement.js

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Rating,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { reviewAPI, employeeAPI } from '../services/api';

const ReviewManagement = ({ onEdit, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, review: null });
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [reviewStats, setReviewStats] = useState({});

  useEffect(() => {
    fetchReviews();
    fetchEmployees();
  }, [refreshTrigger]);

  const fetchReviews = async (employeeId = null) => {
    try {
      setLoading(true);
      const response = await reviewAPI.getReviews(employeeId);
      setReviews(response.data.results || response.data);
      setError(null);
      const [reviewStatsRes] = await Promise.all([
              reviewAPI.getReviewStats(employeeId)
            ]);
            setReviewStats(reviewStatsRes.data);
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getEmployees();
      setEmployees(response.data.results || response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleDeleteReview = async (review) => {
    try {
      await reviewAPI.deleteReview(review.id);
      setReviews(reviews.filter(rev => rev.id !== review.id));
      setDeleteDialog({ open: false, review: null });
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'error';
  };

  const filteredReviews = reviews.filter(review => 
    employeeFilter === '' || review.employee.toString() === employeeFilter
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Review Management ({reviewStats?.total_reviews || 0} reviews)
        </Typography>
        <TextField
          select
          size="small"
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          label="Filter by Employee"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Employees</MenuItem>
          {employees.map(employee => (
            <MenuItem key={employee.id} value={employee.id.toString()}>
              {employee.full_name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Review Period</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Review Date</TableCell>
              <TableCell>Feedback</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id} hover>
                <TableCell>{review.employee_name}</TableCell>
                <TableCell>
                  <Chip label={review.review_period} size="small" color="primary" />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Rating value={review.rating} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {review.rating}/5
                    </Typography>
                  </Box>
                  <Chip
                    label={review.rating_display}
                    size="small"
                    color={getRatingColor(review.rating)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{formatDate(review.review_date)}</TableCell>
                <TableCell>
                  {review.feedback ? (
                    <Typography variant="body2" noWrap style={{ maxWidth: 200 }}>
                      {review.feedback.length > 50 
                        ? `${review.feedback.substring(0, 50)}...`
                        : review.feedback
                      }
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No feedback
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(review)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setDeleteDialog({ open: true, review })}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredReviews.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary">
              No reviews found. Click "Add Review" to create one.
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, review: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the review for {deleteDialog.review?.employee_name} 
          ({deleteDialog.review?.review_period})? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, review: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteReview(deleteDialog.review)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewManagement;