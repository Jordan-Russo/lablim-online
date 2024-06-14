import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom"
import { supabaseClient as supabase } from '../config/supabase-client';
import { useAuth } from '../hooks/Auth';
 
 
export default function CreateName(){
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate();
  const { user: {id: userID}} = useAuth()

  // eslint-disable-next-line
  useEffect(() => {getInfo()}, [])

  async function getInfo() {
    // Use API to info on the Organization from the orderID
    let { data } = await supabase
    .from('Names')
    .select('name')
    .eq('user_id', userID)
    const name = data[0]?.name ?? ''
    setName(name)
    // console.log(name)
  }

  async function handleSubmit(event) {
      event.preventDefault();
      // console.log(userID, name)
      const { error: upsertionError } = await supabase
        .from('Names')
        .upsert({ user_id: userID, name}, { onConflict: 'user_id' })
      // console.log(upsertionError)

      if(upsertionError){
        setError(upsertionError)
      }else{
        navigate(`/`)
      }
  }
 
  return (
  <>
    <Container>
      <Typography variant="h1" sx={{mt: 5, mb: 2}}>
        Register / Update Name
      </Typography>
      <form onSubmit={handleSubmit}>                
        <Typography variant="small" sx={{color: 'red'}}>
          {error}
        </Typography>   
        <TextField
          type="text"
          color="primary"
          variant='filled'
          label="Name / Business Name"
          onChange={e => setName(e.target.value)}
          value={name}
          required
          fullWidth
          sx={{mb: 4, background: 'darkgray'}}
        />
        <Button variant="contained" color='primary' type="submit">Submit</Button>
      </form>
    </Container>
  </>
  )
}