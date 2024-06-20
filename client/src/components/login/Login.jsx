import React, { useState } from 'react';
import { TextField, Button, Typography, IconButton, InputAdornment, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const [inputVal, setInputVal] = useState({
    email: '',
    password: ''
  });

  const history = useNavigate();

  const setVal = (e) => {
    const { name, value } = e.target;
    setInputVal((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const loginUser = async (e) => {
    e.preventDefault();

    const { email, password } = inputVal;

    if (email === '') {
      toast.error('Please Enter Your Email', {
        position: 'top-center'
      });
    } else if (!email.includes('@')) {
      toast.error('Please Enter Valid Email', {
        position: 'top-center'
      });
    } else if (password === '') {
      toast.error('Please Enter Your Password', {
        position: 'top-center'
      });
    } else if (password.length < 6) {
      toast.error('Password Must Have 6 Characters', {
        position: 'top-center'
      });
    } else {
      try {
        const response = await axios.post('http://localhost:8000/login', {
          email,
          password
        });

        if (response.status === 201) {
          localStorage.setItem('usersDataToken', response.data.result.token);
          history("/dash")
          setInputVal({...inputVal, email: '', password: '' });
        } else {
          toast.error(response.data.error, {
            position: 'top-center'
          });
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error, {
            position: 'top-center'
          });
        } else {
          toast.error('There was an error logging in the user', {
            position: 'top-center'
          });
        }
        console.error(error);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: 4,
        
      }}
    >
      <Box
        sx={{
          padding: 6,
          width: '100%',
          maxWidth: 400,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
       backgroundColor: '#f1f1f1',
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
          Welcome to User Login
        </Typography>
        <Typography variant="subtitle1" gutterBottom textAlign="center" fontWeight="bold">
          Hi, we are glad you're back.. Please Login
        </Typography>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            id="email"
            value={inputVal.email}
            onChange={setVal}
            placeholder="Enter Your Email Address"
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            name="password"
            id="password"
            onChange={setVal}
            value={inputVal.password}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter Your Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button fullWidth variant="contained" color="primary" type="submit" onClick={loginUser}>
            Login
          </Button>
          <Typography variant="body1" textAlign="center">
            Don't have an Account? <NavLink to='/register'>Sign Up</NavLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
