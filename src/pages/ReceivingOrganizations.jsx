import { useState, useEffect } from "react";
import { useAuth } from '../hooks/Auth'
import { supabaseClient as supabase } from '../config/supabase-client';
import { Container, List, ListItem, Typography, useTheme } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";


export default function ReceivingOrganizations(){

  let [organizations, setOrganizations] = useState([]);
  const theme = useTheme()
  const { user: {id: userID}} = useAuth()
  const navigate = useNavigate()
  const hasOrganizations = organizations.length > 0

  async function getOrganizations(setter) {
    // use API to get the names of all the organizations that the userID has permission in
    // Return the name of the company and its ID that the permission was made from
    // setMatches to be the state of them.
    const { data } = await supabase
    .from('Permissions')
    .select("Organizations (name, id)")
    .eq('user_id', userID)
  
    console.log(data)
    setter(data)
  }

  // eslint-disable-next-line
  useEffect(() => { getOrganizations(setOrganizations) }, [])

  return (
  <>
    <Container sx={{pt: 5}}>
    <>
      {hasOrganizations && 
      <>
        <List>
          {organizations.map(({Organizations: {name, id}}) => 
            <ListItem key={id} onClick={() => navigate(`/incoming-orders/${id}`)} sx={{bgcolor: theme.palette.primary.main, mb: 2, display: 'flex', justifyContent: 'center', borderRadius: 10, '&:hover': {
              bgcolor: theme.palette.tertiary.main
            }}}>
              <Typography variant="h2">
                {name}
              </Typography>
            </ListItem>
          )}
        </List>
      </>
      }
      {hasOrganizations || 
      <>
        <small>Not in an organization? <Link to="/create-new-organization">Make one here!</Link></small>
      </>
      }
      {/* check if user owns any orgs, if so display them, if not display message telling them to make one */}
    </>
    </Container>
  </>
  )
}