import * as React from 'react'
import { LocalStorageOptions } from '../../background/storage'
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

export default function Settings()
{
  const [options, setOptions] = React.useState<LocalStorageOptions | null>(null)
  const [expanded, setExpanded] = React.useState<string | boolean>(false)

  React.useEffect(() => {
    chrome.storage.sync.get('options', (data) => {setOptions(data.options); console.log(data.options)});
  }, [])

  React.useEffect(() => {
    if(options) chrome.storage.sync.set({options});
  }, [options])
  
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onSwitch = e => {
    const {name, checked} = e.target
    setOptions({...options, [name]:checked})
  }

  if (!options) {
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
              control={<Switch name='mode' checked={options.mode} onChange={onSwitch} />} 
              label={options.mode ? 'Accessibility mode' : 'Regular mode'} 
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