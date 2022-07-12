import * as React from 'react'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Markdown from '../components/Markdown'
import post from '../markdowns/intro.md'

export default function Intro() {
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
      <Typography variant='h5' gutterBottom>
        Introduction
      </Typography>
      <Divider />
      <Markdown className='markdown'>{post}</Markdown>
    </Grid>
  )
}
