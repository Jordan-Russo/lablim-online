import { Box, Button, Container, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function GettingStarted() {
  return (
    <Container>
      <Box sx={{my: 5}}>
        <Typography variant='h1' sx={{color: 'primary.main', my: 1}}>Getting Started</Typography>
        <Typography variant="h2" sx={{ my: 1}}>Welcome to LabLIM Online!</Typography>
      </Box>
      <Box sx={{my: 5}}>
        <Typography variant='h2' sx={{color: 'primary.main', my: 1}}>Making an organization</Typography>
        <Typography variant="p">Now that you have an account, you can choose to create an organization by going here:</Typography>
        <NavLink to="/create-new-organization">
          <Button variant="contained" sx={{display: 'block', my: 1}}>
            <Typography variant="p" component="span">New Organization</Typography>
          </Button>
        </NavLink>
      </Box>
      <Box sx={{my: 5}}>
        <Typography variant='h2' sx={{color: 'primary.main', my: 1}}>Managing an Organization</Typography>
        <Typography variant="p">Now that you have an organization, you can choose how to manage that organization by adding/removing members and modifying their roles by going here:</Typography>
        <NavLink to="/manage-organization">
          <Button variant="contained" sx={{display: 'block', my: 1}}>
            <Typography variant="p" component="span">Manage Organization</Typography>
          </Button>
        </NavLink>
      </Box>
      <Box sx={{my: 5}}>
        <Typography variant='h2' sx={{color: 'primary.main', my: 1}}>Joining & Handling Orders in an Organization</Typography>
        <Typography variant="p">If you were added to an organization, you can view any inbound orders that are coming for you to do by going here and selecting the organization you're a part of:</Typography>
        <NavLink to="/incoming-orders">
          <Button variant="contained" sx={{display: 'block', my: 1}}>
            <Typography variant="p" component="span">Handle Orders</Typography>
          </Button>
        </NavLink>
      </Box>
      <Box sx={{my: 5}}>
        <Typography variant='h2' sx={{color: 'primary.main', my: 1}}>Making Orders</Typography>
        <Typography variant="p">If you're a customer who wishes to make orders to a company, you can fill out an order by going here and submitting it to the organization you want to send the order to:</Typography>
        <NavLink to="/create-new-order">
          <Button variant="contained" sx={{display: 'block', my: 1}}>
            <Typography variant="p" component="span">Create New Order</Typography>
          </Button>
        </NavLink>
      </Box>
      <Box sx={{my: 5}}>
        <Typography variant='h2' sx={{color: 'primary.main', my: 1}}>Viewing Reports</Typography>
        <Typography variant="p">If you're a customer who made an order and wishes to see the order status or the results after the order status is completed you can view active information on your order by going here:</Typography>
        <NavLink to="/manage-order">
          <Button variant="contained" sx={{display: 'block', my: 1}}>
            <Typography variant="p" component="span">My Orders</Typography>
          </Button>
        </NavLink>
      </Box>
    </Container>
  );
}