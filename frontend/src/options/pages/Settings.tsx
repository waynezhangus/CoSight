import * as React from 'react'
import { LocalStorageUser } from '../../background/storage'
// MUI Components
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Container from '@mui/material/Container'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
// MUI Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { userUpdate } from '../../background/api'

export default function Settings()
{
  const [user, setUser] = React.useState<LocalStorageUser | null>(null)
  const [expanded, setExpanded] = React.useState<string | boolean>(false)

  React.useEffect(() => {
    chrome.storage.sync.get('user', (data) => setUser(data.user));
  }, [])

  React.useEffect(() => {
    if(user?._id) {
      chrome.storage.sync.set({user});
      userUpdate(user);
    }
  }, [user])
  
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onSwitch = e => {
    const {name, checked} = e.target
    setUser({...user, [name]:checked})
  }

  if (!user?._id) {
    return null
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
          <Typography sx={{ width: '33%', flexShrink: 0, pl: 1.3 }}>Account Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup sx={{ pl: 1.2, flexDirection: 'row' }}>
            <FormControlLabel
              control={<Switch name='mode' checked={user.mode} onChange={onSwitch} />} 
              label={user.mode ? 'Accessibility mode' : 'Regular mode'} 
            />
            
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
          <Typography sx={{ width: '33%', flexShrink: 0, pl: 1.3 }}>Audio Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
          <Typography sx={{ width: '33%', flexShrink: 0, pl: 1.3 }}>Video Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          
        </AccordionDetails>
      </Accordion>
    </Container>
  )
}