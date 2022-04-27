import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { test } from '../background/optSlice'
import type { RootState } from '../background/store'

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

const mapState = (state: RootState) => ({ options: state.opt })
const connector = connect(mapState)
type PropsRedux = ConnectedProps<typeof connector>
interface Props extends PropsRedux {}

function App ({ options, dispatch }: Props)
{
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

export default connector(App)