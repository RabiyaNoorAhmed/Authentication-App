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
  const { loginData, setLoginData } = useContext(LoginContext);
  const history = useNavigate();
  const [data, setData] = useState(false);

  useEffect(() => {
    const dashboardValid = async () => {
      let token = localStorage.getItem('usersDataToken');

      try {
        const res = await axios.get('http://localhost:8000/validuser', {
          headers: {
            Authorization: token,
          },
        });
        const data = res.data;
        if (data.status === 401 || !data) {
          history('*');
        } else {
          setLoginData(data);
          history('/dash');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        history('*');
      }
    };

    setTimeout(() => {
      dashboardValid();
      setData(true);
    }, 2000);
    dashboardValid();
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
