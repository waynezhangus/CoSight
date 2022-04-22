import React from 'react'
import { useAppSelector, useAppDispatch } from '../background/hooks'
import { update } from '../background/optSlice'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button'

export default function App ({ store })
{
  const dispatch = useAppDispatch()

  const onClick = async (e) => {

  }

  return (
    <Container component="main" maxWidth="xs">
      <Alert
        sx={{ mt: 3, mb: 2 }}
        severity="warning"
        action={
          <Button 
            sx={{ mt: 3, mb: 2 }}
            variant="contained" 
            color="inherit" 
            onClick={onClick}>
            Request
          </Button>
        }
      >
        <AlertTitle>Video not processed</AlertTitle>
        The video you're watching hasn't been processed by CoSight. <strong>Request here!</strong>
      </Alert>
    </Container>
  )
}