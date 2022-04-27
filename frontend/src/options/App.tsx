import * as React from "react"
import { connect, ConnectedProps } from 'react-redux'
import { update } from '../background/optSlice'
import type { RootState } from '../background/store'
import Header from './Header'
import Footer from './Footer'
// MUI Components
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// MUI Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const mapState = (state: RootState) => ({ options: state.opt })
const connector = connect(mapState)
type PropsRedux = ConnectedProps<typeof connector>
interface Props extends PropsRedux {}

function App ({ options, dispatch }: Props)
{
  const [expanded, setExpanded] = React.useState<string | boolean>(false)
  
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onSwitch = e => {
    const {name, checked} = e.target
    dispatch(update({ [name]: checked }))
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
      </Container>
      <Footer/>
    </>
  )
}

export default connector(App)