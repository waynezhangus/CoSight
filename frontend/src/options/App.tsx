import * as React from "react"
import { useAppSelector, useAppDispatch } from '../background/hooks'
import { update } from '../background/optSlice'
import Header from './Header'
import Footer from './Footer'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function App ({ store })
{
  const dispatch = useAppDispatch()
  const [options, setOptions] = React.useState(store.getState().opt)

  const [expanded, setExpanded] = React.useState<string | boolean>(false)
  
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onSwitch = e => {
    const {name, checked} = e.target;
    setOptions(prev => ({...prev, [name]:checked}))
  }

  const onSave = async () => {
    await dispatch(update(options))
    setOptions(store.getState().opt)
  }

  return (
    <>
      <Header/>
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
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onSave} variant="contained">
            Save
          </Button>
        </Box>
      </Container>
      <Footer/>
    </>
  )
}