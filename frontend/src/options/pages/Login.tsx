import * as React from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import Footer from '../components/Footer'

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { userLogin } from '../../background/api'

export default function Login() {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()

  const handleClose: any = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  const onChange = e => {
    const {name, value} = e.target
    setFormData({...formData, [name]:value})
  }

  const onSubmit = async e => {
    e.preventDefault()
    const user = await userLogin(formData)
    if (user) navigate('/')
    else setOpen(true);
  }

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert 
          onClose={handleClose} 
          severity="error" 
          elevation={6}
          variant="filled"
          sx={{ width: '100%' }}>
          Failed to sign in.
        </Alert>
      </Snackbar>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box sx={{ mt: 1 }} component="form" onSubmit={onSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            autoComplete="email"
            autoFocus
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}                   
            autoComplete="current-password"
            onChange={onChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            sx={{ mt: 3, mb: 2 }}
            fullWidth
            variant="contained"
            type="submit"           
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to='/register' variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer/>
    </Container>
  );
}