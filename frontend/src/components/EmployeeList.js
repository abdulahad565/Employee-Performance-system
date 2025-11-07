// frontend/src/components/EmployeeList.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Rating,
  Box,
  CircularProgress,
  Alert,
  Button,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import { Person, Business, CalendarToday } from '@mui/icons-material';
import { employeeAPI } from '../services/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getEmployees();
      setEmployees(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await employeeAPI.getDepartments();
      const uniqueDepartments = [...new Set(response.data)];
      setDepartments(uniqueDepartments);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === '' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Employees
        </Typography>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            variant="outlined"
            label="Department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map(dept => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Reviews</TableCell>
              <TableCell>Avg Rating</TableCell>
              <TableCell>Latest Review</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow 
                key={employee.id}
                hover
                onClick={() => navigate(`/employees/${employee.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {employee.full_name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={employee.department}
                    variant="outlined"
                    icon={<Business />}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    {formatDate(employee.date_of_joining)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${employee.reviews_count} review${employee.reviews_count !== 1 ? 's' : ''}`}
                    variant="filled"
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {employee.average_rating ? (
                    <Box display="flex" alignItems="center">
                      <Rating 
                        value={employee.average_rating} 
                        precision={0.1} 
                        size="small" 
                        readOnly 
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({employee.average_rating})
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No reviews
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {employee.latest_review_period || 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredEmployees.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              No employees found
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default EmployeeList;