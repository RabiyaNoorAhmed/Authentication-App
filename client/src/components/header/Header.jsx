import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import { LoginContext } from '../contextProvider/Context';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate,NavLink } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const theme = useTheme();
  const { loginData, setLoginData } = useContext(LoginContext);
  const history = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutUser = async () => {
    try {
      const token = localStorage.getItem('usersDataToken');
      const res = await axios.get('http://localhost:8000/logout', {
        headers: {
          Authorization: token,
        },
      });
      const data = res.data;
      // console.log(data);
      if (data.status === 201) {
        console.log("User logged out successfully");
        localStorage.removeItem('usersDataToken');
        setLoginData(false);
        history('/');
      } else {
        console.log("Logout failed");
      }
    } catch (error) {
      console.error('Error logging out:', error);
      history('*');
    }
  };

  const goError = () => {
    history("*");
  };

  const goDashboard = () => {
    history("/dash");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" component={NavLink} to="/"
        sx={{ flexGrow: 1 ,color:theme.palette.secondary.main,textDecoration:'none'}}>
          Secure
          <span style={{ color: theme.palette.background.paper, fontWeight: "bold" }}>Sign</span>
        </Typography>
        {loginData.ValidUserOne ? (
          <Avatar
            style={{
              color: theme.palette.primary.main,
              background: theme.palette.secondary.main,
              fontWeight: "bold",
              cursor: 'pointer'
            }}
            onClick={handleClick}
          >
            {loginData.ValidUserOne.fname[0].toUpperCase()}
          </Avatar>
        ) : (
          <Avatar
            style={{
              color: theme.palette.primary.main,
              background: theme.palette.secondary.main,
              cursor: 'pointer'
            }}
            onClick={handleClick}
          />
        )}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          PaperProps={{
            sx: {
              background: theme.palette.secondary.main,
            },
          }}
        >
          {loginData.ValidUserOne ? (
            [
              <MenuItem key="profile" onClick={goDashboard}>Profile</MenuItem>,
              <MenuItem key="logout" onClick={logoutUser}>Logout</MenuItem>
            ]
          ) : (
            [
              <MenuItem key="profile" onClick={goError}>Profile</MenuItem>
            ]
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
