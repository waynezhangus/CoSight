import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRouteMatch } from '../utils'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { LocalStorageUser } from '../../background/storage'

function Header() {
  const navigate = useNavigate()
  const [user, setUser] = React.useState<LocalStorageUser | null>(null)

  React.useEffect(() => {
    chrome.storage.sync.get('user', (data) => setUser(data.user));
  }, [])

  const routeMatch = useRouteMatch(['/intro', '/manual', '/settings', '/profile']);
  const currentTab = routeMatch?.pattern?.path;

  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const onCloseUserMenu = () => { setAnchorElUser(null) }

  const onLogout = () => {
    onCloseUserMenu()
    let user: LocalStorageUser = {
      mode: false,
    }
    chrome.storage.sync.set({user})
    navigate('/login')
  };

  const mdNavMenu = (
    <>
      <Typography
        sx={{ flexGrow: 1.3, display: { xs: 'none', md: 'flex' } }}
        variant="h6"       
        component="div"
        noWrap        
      >
        CoSight
      </Typography>
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        <Tabs
            value={currentTab ?? false}
            indicatorColor="primary"
            textColor="inherit"
            variant="fullWidth"
        >
          <Tab label='Intro' value='/intro' component={Link} to='/intro' />
          <Tab label='Manual' value='/manual' component={Link} to='/manual' />
          <Tab label='Settings' value='/settings' component={Link} to='/settings' />
          <Tab label='Profile' value='/profile' component={Link} to='/profile' />
        </Tabs>
      </Box>
    </>
  )

  const timeNow = (new Date()).getHours()
  const timeString = (timeNow < 6) ? 'night' 
                        : (timeNow < 12) ? 'morning'
                        : (timeNow < 18) ? 'afternoon'
                        : 'evening'

  const userMenu = (
    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
      <Typography
        sx={{ flexGrow: 1 }}
        variant="subtitle2"       
        component="div"
        noWrap        
      >
        {user?.name ? (`Good ${timeString}, ${user.name}.`) : 'Welcome! Please log in.'}
      </Typography>
      <Tooltip title="Account operations">
        <IconButton 
          sx={{ p: 0, ml: 2 }} 
          onClick={(e) => {setAnchorElUser(e.currentTarget)}}
        >
          <Avatar alt="Avatar" src={`https://api.multiavatar.com/${user?._id ?? ''}.png`} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"          
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        open={Boolean(anchorElUser)}
        onClose={onCloseUserMenu}
      >
        {user?.name
          ? [ 
              <MenuItem onClick={onLogout} key='Logout'>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>,
              <MenuItem onClick={onCloseUserMenu} key='Help'>
                <Typography textAlign="center">Help</Typography>
              </MenuItem>,
          ]
          : [
            <MenuItem onClick={onCloseUserMenu} key='Login' component={Link} to='/login'>
                <Typography textAlign="center">Login</Typography>
            </MenuItem>,
            <MenuItem onClick={onCloseUserMenu} key='Help'>
              <Typography textAlign="center">Help</Typography>
            </MenuItem>
          ]
        }
      </Menu>
    </Box>
  )

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <>
            {mdNavMenu}
            {userMenu}
          </>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header
