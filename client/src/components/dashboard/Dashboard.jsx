import React, { useEffect, useContext, useState } from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import axios from 'axios';
import userIcon from '../../assets/images/usericon.png';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contextProvider/Context';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
const Dashboard = () => {
  const theme = useTheme();
  // Get loginData and setLoginData from context
  const { loginData, setLoginData } = useContext(LoginContext);
  // Initialize navigation
  const history = useNavigate();
  // State to check if data is loaded
  const [data, setData] = useState(false);

  useEffect(() => {
    // Function to validate the dashboard access
    const dashboardValid = async () => {
      // Get the token from localStorage
      let token = localStorage.getItem('usersDataToken');

      try {
        const res = await axios.get('http://localhost:8000/validuser', {
          headers: {
            Authorization: token,
          },
        });
        // Get the response data
        const data = res.data;
        
        if (data.status === 401 || !data) {
          // If the user is not authorized, redirect to the error page
          history('*');
        } else {
         // If the user is valid, update loginData and redirect to the dashboard
          setLoginData(data);
          history('/dash');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        history('*');
      }
    };
 // Call the validation function after a 2-second delay
    setTimeout(() => {
      dashboardValid();
      setData(true); // Set data as true to indicate loading is complete
    }, 2000);
    dashboardValid();// Also call the validation function immediately
  }, [setLoginData, history]);

  return (
   <>
    {
      data ?  <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
     
      p={4}
    >
      <Avatar
        src={userIcon}
        alt="User Icon"
        sx={{ width: 300, height: 300, mb: 1 }}
      />
      <Typography
        variant="h4"
        component="h2"
        color="textPrimary"
        textAlign="center"
        fontWeight="bold"
        textTransform={"capitalize"}
      >
        User Name: {loginData.ValidUserOne ? loginData.ValidUserOne.fname : ''}
      </Typography>
      <Typography
        variant="h4"
        component="h1"
        color="textPrimary"
        textAlign="center"
        fontWeight="bold"
      >
        User Email: {loginData.ValidUserOne ? loginData.ValidUserOne.email : ''}
      </Typography>
    </Box>:  <Box sx={{ display: 'flex', justifyContent:'center',alignItems:'center',height:'100vh' }}>
        Loading...
          <CircularProgress sx={{ color:theme.palette.primary.main,}}  />
        </Box>
    }
   </>
   
  );
};

export default Dashboard;
