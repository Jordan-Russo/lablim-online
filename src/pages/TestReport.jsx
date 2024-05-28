import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from '../hooks/Auth'
import { useState, useEffect } from "react";
import { supabaseClient as supabase } from '../config/supabase-client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function TestReport(){
  const { orderID } = useParams();
  const [organizationInfo, setOrganizationInfo] = useState({})
  const [customerInfo, setCustomerInfo] = useState({})
  const [samples, setSamples] = useState([])
  const { user: {id: userID}} = useAuth();
  // userID will be used to prevent DB entry to unauthorized users
  const navigate = useNavigate();

  async function getInfo() {
    
    // Use API to info on the Organization from the orderID
    let { data: orderData } = await supabase
    .from('Orders')
    .select('Organizations(*), users(*, Names(*)), Samples(*, Tests(*))')
    .eq('id', orderID)
    
    console.log("order data from api", orderData)
    
    const {
      Organizations: {
        id: organizationID, 
        name: organizationName, 
        phone: organizationPhone , 
        email: organizationEmail, 
        address: organizationAddress 
      },
      users: {
        id: customerID,
        email: customerEmail,
        Names: {
          name: customerName
        }
      }
    } = orderData[0]
    
    const samples = orderData[0]?.Samples ?? []
    setSamples(samples)
    
    setOrganizationInfo({organizationID, organizationName, organizationPhone, organizationEmail, organizationAddress})
    setCustomerInfo({customerID, customerEmail, customerName})

    // If user did not create order or is not from the organization, redirect them from the page
    // or to exclude certain types of users

    const { count: isOwner } = await supabase
      .from('Orders')
      .select('*', { count: 'exact', head: true })
      .eq('order_requested_by', userID)
      .eq('id', orderID)

    const { count: isFromOrganization } = await supabase
      .from('Permissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userID)
      .eq('organization_id', organizationID)

    console.log(`Is Owner: ${Boolean(isOwner)}. Is From Organiztion ${Boolean(isFromOrganization)}`)

    const notAuthorized = !isOwner && !isFromOrganization

    if(notAuthorized){
      navigate('/manage-order')
      return;
    }
  }

  // https://mui.com/x/react-data-grid/editing/#system-FullFeaturedCrudGrid.js
  function ReportSheet() {
    return (
      <>
        <Box sx={{mb: 8, textAlign: 'center'}}>
          <Typography variant="h1" sx={{ mb: 1}}>
            TEST REPORT
          </Typography>
          <Typography component="p">
            {`Order # ${orderID}`}
          </Typography>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 6}}>
          <Box sx={{textAlign: 'left'}}>
            <Typography component="p">
              {organizationInfo.organizationName}
            </Typography>
            <Typography component="p">
              {organizationInfo.organizationAddress}
            </Typography>
            <Typography component="p">
              {organizationInfo.organizationPhone}
            </Typography>
            <Typography component="p">
              {organizationInfo.organizationEmail}
            </Typography>            
          </Box>
          <Box sx={{textAlign: 'right'}}>
            <Typography component="p">
              {customerInfo.customerName}
            </Typography>    
            <Typography component="p">
              {customerInfo.customerEmail}
            </Typography>    
            <Typography component="p">
              {`CID # ${customerInfo.customerID}`}
            </Typography>    
          </Box>
        </Box>
        <Box>
          {samples.map(({name: sampleName, id: sampleID}, index ) => {
            return (
              <Box key={sampleID} sx={{mb: 5}}>
                <Typography variant="h2">
                  {sampleName}
                </Typography>
                <BottomBorder />
                <BottomBorder />
                {samples[index].Tests.map(({id: testID, description: testName, result, status}) => {
                  return (
                    <Box key={testID}>
                      <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                        <Box sx={{textAlign: 'left'}}>
                          <Typography variant="h6">
                            {testName}
                          </Typography>
                          <Typography component="p">
                            {result}
                          </Typography>
                        </Box>
                        <Box sx={{textAlign: 'right'}}>
                          <Typography component="p">
                            {`status: ${status}`}
                          </Typography>
                        </Box>
                      </Box>
                      <BottomBorder size="1px"/>
                    </Box>

                  )
                })}
              </Box>
            )
          })}
        </Box>
      </>
    )
  }
  // eslint-disable-next-line
  useEffect(() => {getInfo()}, [])

  function ReturnButton(){
    return (
      <Button color="primary" variant="contained" onClick={() => navigate(`/manage-order/${orderID}`)}>
        Return to Order
      </Button>
    )
  }

  function BottomBorder({size = '3px'}){
    return <Box sx={{width: 1, border: "solid", my: 1, borderWidth: `0px 0px ${size} 0px`}} />
  }

  return (
  <Container sx={{mt: 5}}>
    <ReportSheet>
    </ReportSheet>
    <ReturnButton/>
  </Container>
  )
}