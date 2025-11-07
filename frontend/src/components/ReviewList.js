// frontend/src/components/ReviewList.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Rating,
  Box,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Grid,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import {
  Person,
  CalendarToday,
  Star,
  TrendingUp
} from '@mui/icons-material';
import { reviewAPI, employeeAPI } from '../services/api';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [reviewPeriods, setReviewPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [reviewStats, setReviewStats] = useState({});

  useEffect(() => {
    fetchReviews();
    fetchEmployees();
    fetchReviewPeriods();
  }, []);

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
      console.log('Review stats:', reviewStatsRes.data);
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

  const fetchReviewPeriods = async () => {
    try {
      // const response = await reviewAPI.getReviewPeriods();
      // setReviewPeriods(response.data);
      const response = await reviewAPI.getReviewPeriods();

// If response.data is directly an array of strings:
// response.data = ["Q1 2024", "Q2 2024", "Q1 2024", "Q3 2024"]
const uniquePeriods = [...new Set(response.data)];
setReviewPeriods(uniquePeriods);
    } catch (err) {
      console.error('Error fetching review periods:', err);
    }
  };

  const handleEmployeeChange = (event) => {
    const employeeId = event.target.value;
    setSelectedEmployee(employeeId);
    fetchReviews(employeeId || null);
  };

  // const filteredReviews = reviews.filter(review => {
  //   const matchesPeriod = selectedPeriod === '' || review.review_period === selectedPeriod;
  //   return matchesPeriod;
  // });
  const filteredReviews = !selectedPeriod
    ? reviews
    : reviews.filter(review => review.review_period === selectedPeriod);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success.main';
    if (rating >= 3) return 'warning.main';
    return 'error.main';
  };

  const getAverageRating = () => {
    if (filteredReviews.length === 0) return 0;
    const sum = filteredReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / filteredReviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredReviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

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

  const ratingDistribution = getRatingDistribution();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Performance Reviews
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Star sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary.main">
                    {reviewStats?.total_reviews || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Reviews
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="success.main">
                    {getAverageRating()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rating Distribution
              </Typography>
              <Grid container spacing={1}>
                {[5, 4, 3, 2, 1].map(rating => (
                  <Grid item xs key={rating}>
                    <Box textAlign="center">
                      <Typography variant="h6" color={getRatingColor(rating)}>
                        {ratingDistribution[rating]}
                      </Typography>
                      <Rating value={rating} max={1} size="small" readOnly />
                      <Typography variant="caption" display="block">
                        {rating} star{rating !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            variant="outlined"
            label="Filter by Employee"
            value={selectedEmployee}
            onChange={handleEmployeeChange}
          >
            <MenuItem value="">All Employees</MenuItem>
            {employees.map(employee => (
              <MenuItem key={employee.id} value={employee.id}>
                {employee.full_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            variant="outlined"
            label="Filter by Period"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <MenuItem value="">All Periods</MenuItem>
            {reviewPeriods.map(period => (
              <MenuItem key={period} value={period}>{period}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Review Period</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Review Date</TableCell>
              <TableCell>Feedback</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    <Link
                      to={`/employees/${review.employee}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Typography variant="subtitle2" sx={{ '&:hover': { color: 'primary.main' } }}>
                        {review.employee_name}
                      </Typography>
                    </Link>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={review.review_period}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Rating
                      value={review.rating}
                      size="small"
                      readOnly
                    />
                    <Typography
                      variant="body2"
                      sx={{ ml: 1, color: getRatingColor(review.rating) }}
                    >
                      {review.rating}/5
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {review.rating_display}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    {formatDate(review.review_date)}
                  </Box>
                </TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredReviews.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              No reviews found
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default ReviewList;