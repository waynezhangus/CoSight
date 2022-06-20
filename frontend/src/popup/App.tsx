import * as React from 'react'
import { LocalStorageVideo } from '../background/storage';
import { addVideo } from '../background/api';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container'

export default function App()
{
  const [video, setVideo] = React.useState<LocalStorageVideo | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    chrome.storage.local.get('video', data => setVideo(data.video));
  }, [])

  const videoFound = video?.status == 'available' ? true : false;

  const onClick = async () => {
    if (!videoFound) {
      setLoading(true)
      await addVideo(video.videoId)
      setLoading(false)
      setVideo({...video, status: 'available'})
      chrome.tabs.reload()
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Alert
        sx={{ mt: 3, mb: 2 }}
        severity={videoFound ? 'success' : 'warning'}
        action={
          <Box sx={{ m: 1, position: 'relative' }}>
            <Button 
              sx={{ mt: 3, mb: 2 }}
              variant="contained" 
              color="inherit" 
              onClick={onClick}>
              {videoFound ? <CheckIcon /> : 'Request'}
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '40%',
                  left: '40%',
                }}
              />
            )}
          </Box>
        }
      >
        <AlertTitle>{videoFound ? 'Video processed' : 'Video not processed'}</AlertTitle>
          {videoFound ? 'This video has been processed by CoSight! ' : "This video hasn't been processed by CoSight. "} 
          <strong>{videoFound ? 'Enjoy.' : 'Request here!'}</strong>
      </Alert>
    </Container>
  )
}