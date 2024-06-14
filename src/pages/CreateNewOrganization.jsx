import { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { Link, useNavigate } from "react-router-dom"
import { supabaseClient as supabase } from '../config/supabase-client';
import { useAuth } from '../hooks/Auth';
 
 
export default function CreateNewOrganization(){
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const { user: {id: userID}} = useAuth()
 
    async function handleSubmit(event) {
        event.preventDefault();
        const { count } = await supabase
        .from('Organizations')
        .select("*", { count: "exact", head: true })
        .ilike('name', name);
        // make a DB request to insert name
        if(count === 0){          
          // insert info into DB
          const { data: [{id: organizationID}], error: searchError } = await supabase
            .from('Organizations')
            .insert({ name, phone, email, address })
            .select()
          if(searchError){
            console.error("search error:", searchError)
          }
          
          // console.log(organizationID, userID)

          const { error: insertionError } = await supabase
            .from('Permissions')
            .insert({ 
              organization_id: organizationID, 
              user_id: userID, 
              permission_level: 'owner' })

          if(insertionError){
            console.error("insertion error:", insertionError)
          }

          // CREATING AN ORG SHOULD ADD THE PERSON WHO CREATED IT AS OWNER

          // const [{id}] = data
          navigate(`/manage-organization/${organizationID}`)
          // redirect to managing the organization page
        }else{
          setError('This organization is already registered, please choose a different name.')
        }
        // if there's an error, return it
        // console.log(name, email, phone, address) 

    }
 
    return (
        <>
            <Container>
              <Typography variant="h1" sx={{mt: 5, mb: 2}}>
                Register Organization
              </Typography>
              <form onSubmit={handleSubmit}>                
                <Typography variant="small" sx={{color: 'red'}}>
                  {error}
                </Typography>   
                <TextField
                  type="text"
                  color="primary"
                  variant='filled'
                  label="Organization Name"
                  onChange={e => setName(e.target.value)}
                  value={name}
                  required
                  fullWidth
                  sx={{mb: 4, background: 'darkgray'}}
                />
                <TextField
                  type="email"
                  color="primary"
                  variant='filled'
                  label="Organization Email"
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  fullWidth
                  required
                  sx={{mb: 4, background: 'darkgray'}}
                />
                <TextField
                  type="tel"
                  color="primary"
                  variant='filled'
                  label="Organization Phone Number"
                  onChange={e => setPhone(e.target.value)}
                  value={phone}
                  required
                  fullWidth
                  sx={{mb: 4, background: 'darkgray'}}
                />
                <TextField
                  type="text"
                  color="primary"
                  variant='filled'
                  label="Organization Address"
                  onChange={e => setAddress(e.target.value)}
                  value={address}
                  required
                  fullWidth
                  sx={{mb: 4, background: 'darkgray'}}
                />
                <Button variant="contained" color='primary' type="submit">Register</Button>
              </form>
            <small>Already made an organization? <Link to="/manage-organization">Find it here</Link></small>
            </Container>
     
        </>
    )
}