import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/Auth';
import { FaGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material';
import { supabaseClient as supabase } from "../config/supabase-client";

const pages = [
  {page: 'Create Organization', route: '/create-new-organization'},
  {page: 'Manage Organization', route: '/manage-organization'},
  {page: 'Create Order', route: '/create-new-order'},
  {page: 'Manage Order', route: '/manage-order'},
];

const settings = [
  /* Post MVP Features:
  {page: 'Profile', route: '/'},
  {page: 'Account', route: '/'},
  {page: 'Dashboard', route: '/'}, 
  */
  {page: 'Change Name', route: '/create-name'},
  {page: 'Logout', route: '/logout'},
];

export default function MainNavigation() {
  const { user } = useAuth()
  const theme = useTheme()
  const hasUser = Boolean(user)
  const userID = user?.id
  let navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [name, setName] = useState('');

  // eslint-disable-next-line
  useEffect(() => {getInfo()}, [hasUser])

  async function getInfo(){
    let { data } = await supabase
    .from('Names')
    .select('name')
    .eq('user_id', userID)
    const name = data?.[0]?.name ?? user?.email ?? ''
    console.log(name)
    setName(name)
  }



  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="static" sx={{background: theme.palette.primary.main}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, height: '1.5rem', maxWidth: 180 }}>
            <img src="/imgs/small-logo.png" alt="logo" />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                ml: 1,    
                alignSelf: 'center',            
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                '&:hover, &:focus, &:active': {
                  textDecoration: 'none',
                  color: 'white'
                },                
              }}
            >
              LabLim Online
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map(({page, route}) => (
                <MenuItem key={page} onClick={() => {
                  handleCloseNavMenu()
                  navigate(route)
                }}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              '&:hover, &:focus, &:active': {
                textDecoration: 'none',
                color: 'white'
              },
            }}
          >
            LabLim Online
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'center' } }}>
            {pages.map(({page, route}) => (
              <Button
                key={page}
                onClick={() => {
                  handleCloseNavMenu()
                  navigate(route)
                }}
                sx={{ my: 2, color: 'white', display: 'block', textWrap: 'nowrap'}}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
          <>
            {hasUser || 
              <Button
                onClick={() => {navigate('/login')}}
                sx={{ my: 2, color: 'white', display: 'block'}}
              >
                Login
              </Button>
            }
            {hasUser && 
            <>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Box height="24px" sx={{mr: 1, mt: -1, alignContent: "center"}}>
                    <FaGear/>
                  </Box>
                  <Typography
                  component="p"
                  noWrap
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    textWrap: 'wrap',
                    display: {xs: 'none', lg: 'block'}
                  }}
                  >
                    {hasUser && `${name.length <= 25 ? name : name.slice(0, 22) + '...'}`}
                  </Typography>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                >
                {settings.map(({page, route}) => (
                  <MenuItem key={page} onClick={() => {
                    handleCloseUserMenu()
                    navigate(route)
                  }}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </>
            }
          </>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </>
  );
}