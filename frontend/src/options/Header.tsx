import * as React from "react"

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

import MenuIcon from '@mui/icons-material/Menu'

export default function Header() {

  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const onCloseNavMenu = () => { setAnchorElNav(null) }
  const onCloseUserMenu = () => { setAnchorElUser(null) }

  const xsNavMenu = (
    <>
      <Typography
        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
        variant="h6"     
        component="div"
        noWrap 
      >
        CoSight
      </Typography>
      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          color="inherit"
          onClick={(e) => {setAnchorElNav(e.currentTarget)}}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          sx={{ display: { xs: 'block', md: 'none' } }}
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          keepMounted
          open={Boolean(anchorElNav)}
          onClose={onCloseNavMenu} 
        >
          <MenuItem onClick={onCloseNavMenu} >
            <Typography textAlign="center">Settings</Typography>
          </MenuItem>
          <MenuItem onClick={onCloseNavMenu} >
            <Typography textAlign="center">Help</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </>
  )

  const mdNavMenu = (
    <>
      <Typography
        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
        variant="h6"       
        component="div"
        noWrap        
      >
        CoSight
      </Typography>
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        <Tabs
            value='Settings'
            indicatorColor="primary"
            textColor="inherit"
            variant="fullWidth"
        >
          <Tab label='Settings' value='Settings' />
          <Tab label='Help' value='Help' />
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
        {`Good ${timeString}, Wayne.`}
      </Typography>
      <Tooltip title="Account operations">
        <IconButton 
          sx={{ p: 0, ml: 2 }} 
          onClick={(e) => {setAnchorElUser(e.currentTarget)}}
        >
          <Avatar alt="Avatar" src={`https://api.multiavatar.com/12345.png`} />
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

        <MenuItem onClick={onCloseUserMenu} key='Login' >
            <Typography textAlign="center">Login</Typography>
        </MenuItem>,

      </Menu>
    </Box>
  )

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <>
            {xsNavMenu}
            {mdNavMenu}
            {userMenu}
          </>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

