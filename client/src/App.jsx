import React, { useContext, useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Header from './components/header/Header';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Dashboard from './components/dashboard/Dashboard';
import Error from './components/error/Error';
import theme from './theme';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { LoginContext } from './components/contextProvider/Context';

const App = () => {
  const [data, setData] = useState(false);
  const { loginData, setLoginData } = useContext(LoginContext);
  const history = useNavigate();

  const dashboardValid = async () => {
    let token = localStorage.getItem("usersDataToken");
    try {
      const res = await axios.get("http://localhost:8000/validuser", {
        headers: {
          "Authorization": token
        }
      });
      const data = res.data;
      if (data.status == 401 || !data) {
        history("*")
      } else {
        setLoginData(data)
        history("/dash")

      }

    } catch (error) {
      console.error("Error fetching user data:", error);
      history("*")
    }
  };

  useEffect(() => {
    setTimeout(()=>{
      dashboardValid();
      setData(true)
    },2000)
   
  }, []);
 
  return (
    <>
      {
        data ? <ThemeProvider theme={theme}>
        
          <Header />
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/dash' element={<Dashboard />} />
            <Route path='*' element={<Error />} />
          </Routes>
          <ToastContainer />
        </ThemeProvider> : <Box sx={{ display: 'flex', justifyContent:'center',alignItems:'center',height:'100vh' }}>
        Loading...
        <CircularProgress sx={{ color:theme.palette.primary.main,}}  />
        </Box>
      }

    </>

  );
}

export default App;
