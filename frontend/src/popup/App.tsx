import * as React from 'react'

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { LocalStorageVideo } from '../background/storage';

export default function App()
{
  const [video, setVideo] = React.useState<LocalStorageVideo | null>(null)

  React.useEffect(() => {
    chrome.storage.local.get('video', (data) => {setVideo(data.video); console.log(data.options)});
  }, [])

  const onClick = () => {}

  const status = video.status == 'available'

  return (
    <Container component="main" maxWidth="xs">
      <Alert
        sx={{ mt: 3, mb: 2 }}
        severity={status ? 'success' : 'warning'}
        action={
          <Button 
            sx={{ mt: 3, mb: 2 }}
            variant="contained" 
            color="inherit" 
            onClick={onClick}>
            Reprocess
          </Button>
        }
      >
        <AlertTitle>{status ? 'Video processed' : 'Video not processed'}</AlertTitle>
        {status ? 'This video has been processed by CoSight!' : "The video you're watching hasn't been processed by CoSight."} 
        <strong>{status ? 'Reprocess here.' : 'Request here!'}</strong>
      </Alert>
    </Container>
  )
}