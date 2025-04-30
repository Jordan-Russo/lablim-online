import { useState, useEffect } from "react";
import { useAuth } from '../hooks/Auth'
import { supabaseClient as supabase } from '../config/supabase-client';
import { Container, List, ListItem, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";


export default function OwnedOrders(){

  let [orders, setOrders] = useState([]);
  const { user: {id: userID}} = useAuth()
  const navigate = useNavigate()
  const hasOrders = orders.length > 0
  const color = {
    'processing': '#0052cc',
    'active': '#ee7600',
    'complete': '#006400',
    'canceled': '#990000',
  }

  async function getOwnedOrders(setter) {
    // use API to get the name of the company and date that you made an order to
    // use userID, get all the orders that were made by the user and for each use the order_received_by field to find the company name.
    // sort by most Recent
    // setOrders to be the state of them.
    const { data } = await supabase
    .from('Orders')
    .select("id, created_at, order_status, Organizations (name, id)")
    .eq('order_requested_by', userID)
    .order('created_at', { ascending: false })
  
    setter(data)
  }

  // eslint-disable-next-line
  useEffect(() => { getOwnedOrders(setOrders) }, [])

  return (
  <>
    <Container sx={{pt: 5}}>
    <>
      {hasOrders && 
      <>
        <List>
          {orders.map(({id: orderID, created_at, order_status: orderStatus, Organizations: {name}}) => 
            <ListItem key={orderID} onClick={() => navigate(`/manage-order/${orderID}`)} sx={{bgcolor: color[orderStatus], mb: 2, display: 'flex', justifyContent: 'center', borderRadius: 10, '&:hover': {
              opacity: 0.8
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
        <small>Don't have any orders? <Link to="/create-new-order">Make one here!</Link></small>
      </>
      }
      {/* check if user owns any orders, if so display them, if not display message telling them to make one */}
    </>
    </Container>
  </>
  )
}