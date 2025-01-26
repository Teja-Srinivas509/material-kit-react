import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { signOut } from "firebase/auth";

import { DashboardContent } from 'src/layouts/dashboard/main';
import { auth } from "src/sections/auth/firebaseConfig"; 
import { AnalyticsTypographyAndGrid } from 'src/sections/overview/view/AnalyticsTypographyAndGrid';
import StudentPage from './studentPage';

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const renderContent = () => {
    if (location.pathname === '/dashboard/StudentPage') {
      return <StudentPage />;
    }

    return (
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard/StudentPage')}
        >
          Student Page
        </Button>
        <br />
        <Button
          variant="contained"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    );
  };

  return (
    <DashboardContent>
      <Box mt={2}>{renderContent()}</Box>
      <br />
      <AnalyticsTypographyAndGrid />
    </DashboardContent>
  );
};

export default DashboardPage;
