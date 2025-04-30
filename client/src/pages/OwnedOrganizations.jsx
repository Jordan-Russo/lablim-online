import { useState, useEffect } from "react";
import { useAuth } from '../hooks/Auth'
import { supabaseClient as supabase } from '../config/supabase-client';
import { Container, List, ListItem, Typography, useTheme } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";


export default function OwnedOrganizations(){

  let [organizations, setOrganizations] = useState([]);
  const theme = useTheme()
  const { user: {id: userID}} = useAuth()
  const navigate = useNavigate()
  const hasOrganizations = organizations.length > 0

  async function getOwnedOrganizations(setter) {
    // use API to get the names of all the organizations that are owned from the userID
    // use userID, get name of orgs where the user has owner permissions.
    // setMatches to be the state of them.
    const { data } = await supabase
    .from('Permissions')
    .select("Organizations (name, id)")
    .eq('user_id', userID)
    .eq('permission_level', "owner")
  
    // console.log(data)
    setter(data)
  }

  // eslint-disable-next-line
  useEffect(() => { getOwnedOrganizations(setOrganizations) }, [])

  return (
  <>
    <Container sx={{pt: 5}}>
    <>
      {hasOrganizations && 
      <>
        <List>
          {organizations.map(({Organizations: {name, id}}) => 
            <ListItem key={id} onClick={() => navigate(`/manage-organization/${id}`)} sx={{bgcolor: theme.palette.primary.main, mb: 2, display: 'flex', justifyContent: 'center', borderRadius: 10, '&:hover': {
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
        <small>Don't own an organization? <Link to="/create-new-organization">Make one here!</Link></small>
      </>
      }
      {/* check if user owns any orgs, if so display them, if not display message telling them to make one */}
    </>
    </Container>
  </>
  )
}