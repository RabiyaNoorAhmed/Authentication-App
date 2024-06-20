import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import ErrorImg from '../../assets/images/error.png';

const Error = () => {
  // const history = useHistory();

  // const goToHomePage = () => {
  //   history.push('/');
  // };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"

      p={4}
    >
      <Box
        component="img"
        src={ErrorImg}
        alt="Error"
        sx={{ width: 300, height: 300, mb: 2 }}
      />
      <Typography variant="h4" component="h1" color="textPrimary" textAlign="center" fontWeight="bold">
        PAGE NOT FOUND
      </Typography>
      <Button
        component={NavLink}
        to="/"
        variant="contained"
        color="primary"
        size="large"
        sx={{ fontSize: 18 }}
      >
        Back To Home Page
      </Button>
    </Box>
  );
};

export default Error;

