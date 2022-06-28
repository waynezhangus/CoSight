import * as React from 'react'
import { LocalStorageUser } from '../../background/storage'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Link from '@mui/material/Link';
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import Typography from '@mui/material/Typography';

export default function Profile() {
  const [user, setUser] = React.useState<LocalStorageUser | null>(null)
  const [expanded, setExpanded] = React.useState([])
  const [selected, setSelected] = React.useState([])

  React.useEffect(() => {
    chrome.storage.sync.get('user', (data) => setUser(data.user));
  }, [])

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds)
  };

  // const handleSelect = (event, nodeIds) => {
  //   setSelected(nodeIds)
  // };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 
                            ? user.statistics.map((video, index) => index.toString()) 
                            : [],
    )
  }

  // const handleSelectClick = () => {
  //   setSelected((oldSelected) =>
  //     oldSelected.length === 0 ? ['1', '2', '5', '6', '7', '8', '9'] : [],
  //   )
  // }

  if (!user?.statistics) {
    return null
  }

  let content = user.statistics.map((video, index) => (
    <TreeItem 
      nodeId={index.toString()} 
      key={index.toString()} 
      label={ 
        <Link 
          href={`https://www.youtube.com/watch?v=${video.videoId}`} 
          target='_blank'
          rel='noopener'
        >
          {video.title}   
        </Link>
      }
    >
      {
        video.userComments.map((comment, index) => (
          <TreeItem nodeId={`item${index}`} key={`item${index}`} label={comment} />
        ))
      }
    </TreeItem>
  ))

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Typography variant="h5" gutterBottom>
        Your comments
      </Typography>
      <Divider />
      <Box>
        <Button onClick={handleExpandClick}>
          {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
        {/* <Button onClick={handleSelectClick}>
          {selected.length === 0 ? 'Select all' : 'Unselect all'}
        </Button> */}
      </Box>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        // onNodeSelect={handleSelect}
        multiSelect
      >
        {content}
      </TreeView>
    </Container>
  )
}