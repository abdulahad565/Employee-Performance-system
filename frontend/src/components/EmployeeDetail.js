// frontend/src/components/EmployeeDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Rating,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Avatar
} from '@mui/material';
import {
  Person,
  Email,
  Business,
  CalendarToday,
  ArrowBack,
  Star,
  TrendingUp
} from '@mui/icons-material';
import { employeeAPI } from '../services/api';

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getEmployee(id);
      setEmployee(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employee details');
      console.error('Error fetching employee:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success.main';
    if (rating >= 3) return 'warning.main';
    return 'error.main';
  };

  const getRatingText = (rating) => {
    const ratings = {
      1: "Poor",
      2: "Below Average", 
      3: "Average",
      4: "Good",
      5: "Excellent"
    };
    return ratings[rating] || "Unknown";
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

  if (!employee) {
    return <Alert severity="warning">Employee not found</Alert>;
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          component={Link}
          to="/employees"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Back to Employees
        </Button>
        <Typography variant="h4" component="h1">
          Employee Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Employee Information Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mb: 2
                  }}
                >
                  {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" textAlign="center">
                  {employee.full_name}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box space={2}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Email sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="body1">{employee.email}</Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <Business sx={{ mr: 2, color: 'primary.main' }} />
                  <Chip label={employee.department} variant="outlined" />
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Joined
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(employee.date_of_joining)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Performance Summary Card */}
          <Card elevation={2} sx={{ mt: 2 }} flexDirection={'row'} alignItems="center">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Summary
              </Typography>
              
              <Box mb={2} >
                <Typography variant="body2" color="text.secondary">
                  Total Reviews
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {employee.reviews_count}
                </Typography>
              </Box>

              {employee.average_rating && (
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Average Rating
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Rating
                      value={employee.average_rating}
                      precision={0.1}
                      readOnly
                    />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {employee.average_rating}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: getRatingColor(employee.average_rating) }}
                  >
                    {getRatingText(Math.round(employee.average_rating))}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Reviews */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Reviews
              </Typography>

              {employee.performance_reviews.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <TrendingUp sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No reviews yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Performance reviews will appear here once they are added.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {employee.performance_reviews.map((review, index) => (
                    <Card 
                      key={review.id}
                      variant="outlined"
                      sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}
                    >
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {review.review_period}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(review.review_date)}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            <Box display="flex" alignItems="center">
                              <Rating
                                value={review.rating}
                                readOnly
                                size="small"
                              />
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  ml: 1,
                                  color: getRatingColor(review.rating)
                                }}
                              >
                                {review.rating}/5
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ color: getRatingColor(review.rating) }}
                            >
                              {review.rating_display}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            {review.feedback ? (
                              <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Feedback:
                                </Typography>
                                <Typography variant="body2">
                                  {review.feedback}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No feedback provided
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDetail;