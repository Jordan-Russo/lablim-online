import { useState, useEffect } from "react";
import { useAuth } from '../hooks/Auth'
import { supabaseClient as supabase } from '../config/supabase-client';
import { Container, List, ListItem, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";


export default function IncomingOrders(){

  let [orders, setOrders] = useState([]);
  const { user: {id: userID}} = useAuth()
  const { organizationID } = useParams();
  const navigate = useNavigate()
  const hasOrders = orders.length > 0

  async function getIncomingOrders(setter) {
    // use API to get the name of the company and date that you made an order to
    // use userID, get all the orders that were made by the user and for each use the order_received_by field to find the company name.
    // sort by most Recent
    // setOrders to be the state of them.
    const { count: isFromOrganization } = await supabase
      .from('Permissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userID)
      .eq('organization_id', organizationID)
    
    if(!isFromOrganization){
      navigate('/manage-organization')
      return;
    }

    const { data } = await supabase
    .from('Orders')
    .select("id, created_at, Organizations (name, id)")
    .eq('order_received_by', organizationID)
    .order('created_at', { ascending: false })
  
    setter(data)
  }

  // eslint-disable-next-line
  useEffect(() => { getIncomingOrders(setOrders) }, [])

  return (
  <>
    <Container sx={{pt: 5}}>
    <>
      {hasOrders && 
      <>
        <List>
          {orders.map(({id: orderID, created_at,  Organizations: {name}}) => 
            <ListItem key={orderID} onClick={() => navigate(`/manage-order/${orderID}`)} sx={{bgcolor: '#006400', mb: 2, display: 'flex', justifyContent: 'center', borderRadius: 10, '&:hover': {
              bgcolor: 'green'
            }}}>
              <Typography variant="h2">
                {`${name} - ${new Date(created_at).toLocaleDateString()}`}
              </Typography>
            </ListItem>
          )}
        </List>
      </>
      }
      {hasOrders || 
      <>
        <small>This organization has not received any orders.</small>
      </>
      }
      {/* check if user owns any orders, if so display them, if not display message telling them to make one */}
    </>
    </Container>
  </>
  )
}