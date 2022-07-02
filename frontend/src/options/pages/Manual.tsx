import * as React from 'react'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Markdown from '../components/Markdown';
import post from '../markdowns/manual.md';

export default function Manual() {
  
  return (
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        p: 5,
        '& .markdown': {
          pt: 2,
        },
      }}
    >
      <Typography variant="h5" gutterBottom>
        User Manual
      </Typography>
      <Divider />
      <Box sx={{height: 10}} />
      <Link 
        href="https://docs.google.com/document/d/1kR7qWrMuRok50RcplcQQwXo0nnF60uowt-JmmmZ2Sq0/edit?usp=sharing"
        target="_blank" 
        rel="noreferrer noopener"
      >
        Manual in Google doc.
      </Link>
    </Grid>
  )
}