// frontend/src/components/AdminPanel.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  RateReview as ReviewIcon
} from '@mui/icons-material';
import EmployeeManagement from './EmployeeManagement';
import ReviewManagement from './ReviewManagement';
import EmployeeForm from './EmployeeForm';
import ReviewForm from './ReviewForm';
import { useAuth } from '../context/AuthContext';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return (
      <Alert severity="error">
        Access denied. Admin privileges required.
      </Alert>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Close any open forms when switching tabs
    setShowEmployeeForm(false);
    setShowReviewForm(false);
    setEditingEmployee(null);
    setEditingReview(null);
  };

  const handleEmployeeSave = () => {
    setShowEmployeeForm(false);
    setEditingEmployee(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleReviewSave = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Admin Panel
        </Typography>
        <Box>
          {tabValue === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowEmployeeForm(true)}
              sx={{ mr: 1 }}
            >
              Add Employee
            </Button>
          )}
          {tabValue === 1 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowReviewForm(true)}
            >
              Add Review
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            icon={<PeopleIcon />}
            label="Employee Management"
            iconPosition="start"
          />
          <Tab
            icon={<ReviewIcon />}
            label="Review Management"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <EmployeeManagement
          onEdit={handleEditEmployee}
          refreshTrigger={refreshTrigger}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ReviewManagement
          onEdit={handleEditReview}
          refreshTrigger={refreshTrigger}
        />
      </TabPanel>

      {/* Employee Form Dialog */}
      <EmployeeForm
        open={showEmployeeForm}
        employee={editingEmployee}
        onClose={() => {
          setShowEmployeeForm(false);
          setEditingEmployee(null);
        }}
        onSave={handleEmployeeSave}
      />

      {/* Review Form Dialog */}
      <ReviewForm
        open={showReviewForm}
        review={editingReview}
        onClose={() => {
          setShowReviewForm(false);
          setEditingReview(null);
        }}
        onSave={handleReviewSave}
      />
    </Box>
  );
};

export default AdminPanel;