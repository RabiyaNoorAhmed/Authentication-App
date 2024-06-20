import React, { useState } from 'react';
import { TextField, Button, Typography, IconButton, InputAdornment, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [inputVal, setInputVal] = useState({
    fname: '',
    email: '',
    password: '',
    cpassword: ''
  });

  const setVal = (e) => {
    const { name, value } = e.target;
    setInputVal({
      ...inputVal,
      [name]: value
    });
  };

  const addUserData = async (e) => {
    e.preventDefault();

    const { fname, email, password, cpassword } = inputVal;

    if (fname === "") {
      toast.error("Please Enter Your Name", {
        position: "top-center"
      });
    } else if (email === "") {
      toast.error("Please Enter Your Email", {
        position: "top-center"
      });
    } else if (!email.includes("@")) {
      toast.error("Please Enter Valid Email", {
        position: "top-center"
      });
    } else if (password === "") {
      toast.error("Please Enter Your Password", {
        position: "top-center"
      });
    } else if (password.length < 6) {
      toast.error("Password Must Have 6 Characters", {
        position: "top-center"
      });
    } else if (cpassword === "") {
      toast.error("Please Enter Your Confirm Password", {
        position: "top-center"
      });
    } else if (cpassword.length < 6) {
      toast.error("Confirm Password Must Have 6 Characters", {
        position: "top-center"
      });
    } else if (password !== cpassword) {
      toast.error("Password and Confirm Password Do Not Match", {
        position: "top-center"
      });
    } else {
      try {
        const response = await axios.post("http://localhost:8000/register", {
          fname,
          email,
          password,
          cpassword
        });
        // console.log(response.data);
        toast.success("User Registered Successfully", {
          position: "top-center"
        });
        setInputVal({...inputVal,fname:"",email:"",password:"",cpassword:""})
      } catch (error) {
        toast.error("There was an error registering the user", {
          position: "top-center"
        });
        console.error(error);
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: 2,
     
      }}
    >
      <Box
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          backgroundColor: '#f1f1f1',
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
          Create an Account
        </Typography>
        <Typography variant="subtitle1" gutterBottom textAlign="center" fontWeight="bold">
          Please fill in the details to create an account
        </Typography>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
          onSubmit={addUserData}
        >
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            name="fname"
            id="fname"
            value={inputVal.fname}
            onChange={setVal}
            placeholder="Enter Your Name"
          />
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
            value={inputVal.password}
            onChange={setVal}
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
          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            name="cpassword"
            id="cpassword"
            value={inputVal.cpassword}
            onChange={setVal}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Your Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button fullWidth variant="contained" color="primary" type="submit">
            Sign Up
          </Button>
          <Typography variant="body1" textAlign="center">
            Already have an account? <NavLink to='/'>Login</NavLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
