// frontend/src/components/EmployeeForm.js

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
  Box
} from '@mui/material';
import { employeeAPI } from '../services/api';

const EmployeeForm = ({ open, employee, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    date_of_joining: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (open) {
      fetchDepartments();
      if (employee) {
        setFormData({
          first_name: employee.first_name || '',
          last_name: employee.last_name || '',
          email: employee.email || '',
          department: employee.department || '',
          date_of_joining: employee.date_of_joining || ''
        });
      } else {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          department: '',
          date_of_joining: new Date().toISOString().split('T')[0] // Today's date
        });
      }
      setError('');
    }
  }, [open, employee]);

  const fetchDepartments = async () => {
    try {
      const response = await employeeAPI.getDepartments();
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (employee) {
        await employeeAPI.updateEmployee(employee.id, formData);
      } else {
        await employeeAPI.createEmployee(formData);
      }
      onSave();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.detail ||
                          'Failed to save employee';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      department: '',
      date_of_joining: ''
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="department"
                label="Department"
                value={formData.department}
                onChange={handleChange}
                disabled={loading}
                helperText="Enter department name (e.g., Engineering, Marketing)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="date_of_joining"
                label="Date of Joining"
                type="date"
                value={formData.date_of_joining}
                onChange={handleChange}
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
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
          disabled={loading || !formData.first_name || !formData.last_name || !formData.email}
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            employee ? 'Update Employee' : 'Add Employee'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;