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
  let videoFound = false;

  React.useEffect(() => {
    chrome.storage.local.get('video', (data) => {setVideo(data.video);});
  }, [])

  React.useEffect(() => {
    if(video?.status == 'available') videoFound = true;
  }, [video])

  const onClick = () => {}

  return (
    <Container component="main" maxWidth="xs">
      <Alert
        sx={{ mt: 3, mb: 2 }}
        severity={videoFound ? 'success' : 'warning'}
        action={
          <Button 
            sx={{ mt: 3, mb: 2 }}
            variant="contained" 
            color="inherit" 
            onClick={onClick}>
            {videoFound ? 'Reprocess' : 'Request'}
          </Button>
        }
      >
        <AlertTitle>{videoFound ? 'Video processed' : 'Video not processed'}</AlertTitle>
        {videoFound ? 'This video has been processed by CoSight!' : "The video you're watching hasn't been processed by CoSight."} 
        <strong>{videoFound ? 'Reprocess here.' : 'Request here!'}</strong>
      </Alert>
    </Container>
  )
}