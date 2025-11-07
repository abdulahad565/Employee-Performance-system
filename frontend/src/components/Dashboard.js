// // frontend/src/components/Dashboard.js

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   CircularProgress,
//   Alert,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Divider
// } from '@mui/material';
// import {
//   People,
//   Star,
//   TrendingUp,
//   Business,
//   Person,
//   CalendarToday
// } from '@mui/icons-material';
// import { employeeAPI, reviewAPI } from '../services/api';

// const Dashboard = () => {

  
//   const [employeeStats, setEmployeeStats] = useState(null);
//   const [reviewStats, setReviewStats] = useState(null);
//   const [recentEmployees, setRecentEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch all data concurrently
//       const [employeeStatsRes, reviewStatsRes, employeesRes] = await Promise.all([
//         employeeAPI.getEmployeeStats(),
//         reviewAPI.getReviewStats(),
//         employeeAPI.getEmployees()
//       ]);

//       setEmployeeStats(employeeStatsRes.data);
//       setReviewStats(reviewStatsRes.data);
      
//       // Get recent employees (last 5)
//       const employees = employeesRes.data.results || employeesRes.data;
//       const sortedEmployees = employees.sort((a, b) => 
//         new Date(b.date_of_joining) - new Date(a.date_of_joining)
//       );
//       setRecentEmployees(sortedEmployees.slice(0, 5));
      
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch dashboard data');
//       console.error('Error fetching dashboard data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return <Alert severity="error">{error}</Alert>;
//   }

//   return (
//     <Box>
//       <Typography variant="h4" component="h1" gutterBottom>
//         Dashboard
//       </Typography>
//       <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//         Overview of your employee performance system
//       </Typography>

//       <Grid container spacing={3} sx={{ mt: 2 }}>
//         {/* Statistics Cards */}
//         <Grid item xs={12} sm={6} md={3}>
//           <Card elevation={2}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
//                 <Box>
//                   <Typography variant="h4" color="primary.main">
//                     {employeeStats?.total_employees || 0}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Total Employees
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card elevation={2}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <Star sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
//                 <Box>
//                   <Typography variant="h4" color="warning.main">
//                     {reviewStats?.total_reviews || 0}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Total Reviews
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card elevation={2}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
//                 <Box>
//                   <Typography variant="h4" color="success.main">
//                     {employeeStats?.average_rating || 0}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Average Rating
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card elevation={2}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <Business sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
//                 <Box>
//                   <Typography variant="h4" color="info.main">
//                     {employeeStats?.department_breakdown?.length || 0}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Departments
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Department Breakdown */}
//         <Grid item xs={12} md={6}>
//           <Card elevation={2}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Department Breakdown
//               </Typography>
//               {employeeStats?.department_breakdown?.length > 0 ? (
//                 <List>
//                   {employeeStats.department_breakdown.map((dept, index) => (
//                     <React.Fragment key={dept.department}>
//                       <ListItem>
//                         <ListItemIcon>
//                           <Business color="primary" />
//                         </ListItemIcon>
//                         <ListItemText
//                           primary={dept.department}
//                           secondary={`${dept.count} employee${dept.count !== 1 ? 's' : ''}`}
//                         />
//                         <Typography variant="h6" color="primary.main">
//                           {dept.count}
//                         </Typography>
//                       </ListItem>
//                       {index < employeeStats.department_breakdown.length - 1 && <Divider />}
//                     </React.Fragment>
//                   ))}
//                 </List>
//               ) : (
//                 <Typography variant="body2" color="text.secondary">
//                   No department data available
//                 </Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Rating Distribution */}
//         <Grid item xs={12} md={6}>
//           <Card elevation={2}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Rating Distribution
//               </Typography>
//               {reviewStats?.rating_distribution?.length > 0 ? (
//                 <List>
//                   {reviewStats.rating_distribution
//                     .sort((a, b) => b.rating - a.rating)
//                     .map((rating, index) => (
//                       <React.Fragment key={rating.rating}>
//                         <ListItem>
//                           <ListItemIcon>
//                             <Star 
//                               sx={{ 
//                                 color: rating.rating >= 4 ? 'success.main' : 
//                                        rating.rating >= 3 ? 'warning.main' : 'error.main'
//                               }} 
//                             />
//                           </ListItemIcon>
//                           <ListItemText
//                             primary={`${rating.rating} Star${rating.rating !== 1 ? 's' : ''}`}
//                             secondary={`${rating.count} review${rating.count !== 1 ? 's' : ''}`}
//                           />
//                           <Typography variant="h6" color="primary.main">
//                             {rating.count}
//                           </Typography>
//                         </ListItem>
//                         {index < reviewStats.rating_distribution.length - 1 && <Divider />}
//                       </React.Fragment>
//                     ))}
//                 </List>
//               ) : (
//                 <Typography variant="body2" color="text.secondary">
//                   No rating data available
//                 </Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Recent Employees */}
//         <Grid item xs={12}>
//           <Card elevation={2}>
//             <CardContent>
//               <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                 <Typography variant="h6">
//                   Recent Employees
//                 </Typography>
//                 <Link 
//                   to="/employees" 
//                   style={{ textDecoration: 'none' }}
//                 >
//                   <Typography variant="body2" color="primary.main">
//                     View all employees →
//                   </Typography>
//                 </Link>
//               </Box>
              
//               {recentEmployees.length > 0 ? (
//                 <List>
//                   {recentEmployees.map((employee, index) => (
//                     <React.Fragment key={employee.id}>
//                       <ListItem
//                         component={Link}
//                         to={`/employees/${employee.id}`}
//                         sx={{ 
//                           textDecoration: 'none', 
//                           color: 'inherit',
//                           '&:hover': { bgcolor: 'action.hover' }
//                         }}
//                       >
//                         <ListItemIcon>
//                           <Person color="primary" />
//                         </ListItemIcon>
//                         <ListItemText
//                           primary={employee.full_name}
//                           secondary={
//                             <Box display="flex" alignItems="center">
//                               <Business sx={{ fontSize: 16, mr: 1 }} />
//                               {employee.department}
//                               <CalendarToday sx={{ fontSize: 16, ml: 2, mr: 1 }} />
//                               Joined {formatDate(employee.date_of_joining)}
//                             </Box>
//                           }
//                         />
//                         {employee.reviews_count > 0 && (
//                           <Box textAlign="right">
//                             <Typography variant="body2" color="primary.main">
//                               {employee.reviews_count} review{employee.reviews_count !== 1 ? 's' : ''}
//                             </Typography>
//                             {employee.average_rating && (
//                               <Typography variant="caption" color="text.secondary">
//                                 Avg: {employee.average_rating}/5
//                               </Typography>
//                             )}
//                           </Box>
//                         )}
//                       </ListItem>
//                       {index < recentEmployees.length - 1 && <Divider />}
//                     </React.Fragment>
//                   ))}
//                 </List>
//               ) : (
//                 <Typography variant="body2" color="text.secondary">
//                   No employees found
//                 </Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;
// frontend/src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  People,
  Star,
  TrendingUp,
  Business,
  Person,
  CalendarToday
} from '@mui/icons-material';
import { employeeAPI, reviewAPI } from '../services/api';

const Dashboard = () => {
  const [employeeStats, setEmployeeStats] = useState(null);
  const [reviewStats, setReviewStats] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data concurrently
      const [employeeStatsRes, reviewStatsRes, employeesRes] = await Promise.all([
        employeeAPI.getEmployeeStats(),
        reviewAPI.getReviewStats(),
        employeeAPI.getEmployees()
      ]);

      setEmployeeStats(employeeStatsRes.data);
      setReviewStats(reviewStatsRes.data);
      
      // Get recent employees (last 5)
      const employees = employeesRes.data.results || employeesRes.data;
      const sortedEmployees = employees.sort((a, b) => 
        new Date(b.hire_date) - new Date(a.hire_date)
      );
      setRecentEmployees(sortedEmployees.slice(0, 5));
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

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
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Overview of your employee performance system
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="primary.main">
                    {employeeStats?.total_employees || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Employees
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Star sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="warning.main">
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
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="success.main">
                    {reviewStats?.average_rating || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Business sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {employeeStats?.departments?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Departments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Breakdown */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Department Breakdown
              </Typography>
              {employeeStats?.departments?.length > 0 ? (
                <List>
                  {employeeStats.departments.map((dept, index) => (
                    <React.Fragment key={dept.department}>
                      <ListItem>
                        <ListItemIcon>
                          <Business color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={dept.department}
                          secondary={`${dept.count} employee${dept.count !== 1 ? 's' : ''}`}
                        />
                        <Typography variant="h6" color="primary.main">
                          {dept.count}
                        </Typography>
                      </ListItem>
                      {index < employeeStats.departments.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No department data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Rating Distribution */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rating Distribution
              </Typography>
              {reviewStats?.rating_distribution?.length > 0 ? (
                <List>
                  {reviewStats.rating_distribution
                    .sort((a, b) => b.rating - a.rating)
                    .map((rating, index) => (
                      <React.Fragment key={rating.rating}>
                        <ListItem>
                          <ListItemIcon>
                            <Star 
                              sx={{ 
                                color: rating.rating >= 4 ? 'success.main' : 
                                       rating.rating >= 3 ? 'warning.main' : 'error.main'
                              }} 
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${rating.rating} Star${rating.rating !== 1 ? 's' : ''}`}
                            secondary={`${rating.count} review${rating.count !== 1 ? 's' : ''}`}
                          />
                          <Typography variant="h6" color="primary.main">
                            {rating.count}
                          </Typography>
                        </ListItem>
                        {index < reviewStats.rating_distribution.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No rating data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Employees */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Recent Employees
                </Typography>
                <Link 
                  to="/employees" 
                  style={{ textDecoration: 'none' }}
                >
                  <Typography variant="body2" color="primary.main">
                    View all employees →
                  </Typography>
                </Link>
              </Box>
              
              {recentEmployees.length > 0 ? (
                <List>
                  {recentEmployees.map((employee, index) => (
                    <React.Fragment key={employee.id}>
                      <ListItem
                        component={Link}
                        to={`/employees/${employee.id}`}
                        sx={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                      >
                        <ListItemIcon>
                          <Person color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={employee.full_name}
                          secondary={
                            <Box display="flex" alignItems="center">
                              <Business sx={{ fontSize: 16, mr: 1 }} />
                              {employee.department}
                              <CalendarToday sx={{ fontSize: 16, ml: 2, mr: 1 }} />
                              Joined {formatDate(employee.hire_date)}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentEmployees.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No employees found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;