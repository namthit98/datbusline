import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import Register from './Register';
import Login from './Login';
import Cookies from 'js-cookie';

const Header = ({ token, setToken }) => {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    router.push('/');
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                cursor: 'pointer',
              }}
              onClick={() => router.push('/')}
            >
              Dat Busline
            </Typography>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                cursor: 'pointer',
              }}
              onClick={() => router.push('/')}
            >
              Dat Busline
            </Typography>

            <Box sx={{ flexGrow: 1 }}></Box>

            <Box sx={{ flexGrow: 0 }}>
              {token ? null : (
                <>
                  <Register />
                  <Login setToken={setToken} />
                </>
              )}

              {token ? (
                <>
                  <Tooltip title="Profile">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="Remy Sharp" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
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
                    <MenuItem
                      key={'profile'}
                      onClick={() => {
                        router.push('/profile');
                        handleCloseUserMenu();
                      }}
                    >
                      <Typography textAlign="center">{'Profile'}</Typography>
                    </MenuItem>
                    {/* <MenuItem
                      key={'change-password'}
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">
                        {'Change Password'}
                      </Typography>
                    </MenuItem> */}
                    <MenuItem
                      key={'logout'}
                      onClick={() => {
                        Cookies.remove('bus_management_client_token');
                        setToken('');
                        handleCloseUserMenu();
                        router.push('/');
                      }}
                    >
                      <Typography textAlign="center">{'Logout'}</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : null}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default Header;
