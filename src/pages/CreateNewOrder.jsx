import { useState, useMemo, Fragment } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../hooks/Auth'
import { supabaseClient as supabase } from '../config/supabase-client';
import { randomId } from '@mui/x-data-grid-generator';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
 
 
export default function CreateNewOrder(){
  const orderID = useMemo(() => randomId(), []);
  const [organization, setOrganziation] = useState('')
  const [samples, setSamples] = useState([])
  const [tests, setTests] = useState([])
  const [error, setError] = useState('')
  const { user: {id: userID}} = useAuth();
  let organizationID = ''
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const { data } = await supabase
        .from('Organizations')
        .select('id')
        .ilike('name', organization);
    // make a DB request to insert name
    if(data.length > 0){
      organizationID = data[0].id
    }
    if(!organizationID){
      setError('This organization does not exist, please choose an existing organization.')
    }else{
      // make sure samples and tests are formatted first
        // no samples or tests w/o a form value can be submitted
        // so filter them out first
        // edge case if sample doesn't have a name, all tests involving that sample should also be filtered

      // three api requests to submit
      console.log(orderID)
      const {error: orderError} = await supabase
        .from('Orders')
        .insert({
          id: orderID,
          order_requested_by: userID,
          order_received_by: organizationID
        })
      
      const {data} = await supabase
        .from('Orders')
        .select()
      console.log(data)
      
      console.log(samples)
      const {error: sampleError} = await supabase
        .from('Samples')
        .insert(samples)
      
      console.log(tests)

      const {error: testError} = await supabase
        .from('Tests')
        .insert(tests)

      console.log("order error:", orderError, "sample error:", sampleError, "test error:", testError)

      navigate(`/manage-order/${orderID}`)
    }
    // step 1 - make sure the organization exists first
      // check DB for a organization with a matching name
      // if one doesn't exist set error and don't insert information

    // step 2 - loop through the samples
      // insert all samples into the sample DB
    // step 3 - loop through the tests
      // insert all tests into the test DB

    // step 4 - Redirect the user 
      // navigate the user into the new order page that allows them to manage their order
  }

  function addNewSample() {
    const newSample = {id: randomId(), from_order: orderID, name: ''}
    setSamples([...samples, newSample])
  }
  function addNewTest(_, sampleID) {
    const newTest = {id: randomId(), from_sample: sampleID, description: ''}
    setTests([...tests, newTest])
  }
  function removeNewTest(_, testID) {
    setTests(tests.filter(test => test.id !== testID))
  }
  function removeNewSample(_, sampleID) {
    setSamples(samples.filter(sample => sample.id !== sampleID))
    setTests(tests.filter(test => test.from_sample !== sampleID))
  }

  // other functions - one to handle adding new samples / tests
  // one to handle deleting new samples / tests

  return (
      <>
        <Container>
          <Typography variant="h1" sx={{mt: 5, mb: 2}}>
            Register Order
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
              onChange={e => setOrganziation(e.target.value)}
              value={organization}
              required
              fullWidth
              sx={{mb: 4, background: 'darkgray'}}
            />
            { 
              samples.map(sample => (
                <Fragment key={sample.id}>
                  <Box sx={{display: 'flex', flexWrap: 'no-wrap', alignItems: 'flex-start'}}>
                    <TextField
                      id={sample.id}
                      value={sample.name}
                      type="text"
                      color="primary"
                      variant='filled'
                      label="Sample"
                      onChange={e => setSamples(samples.map(item => {
                        if(item.id === sample.id){
                          return {...item, name: e.target.value}
                        }
                        return item
                      }))}
                      required
                      fullWidth
                      sx={{mb: 4, background: 'darkgray'}}
                      />
                    <IconButton
                      size="large"
                      aria-label="delete sample"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      color="error"
                      onClick={() => removeNewSample(null, sample.id)}
                      >
                      <DeleteForeverIcon/>
                    </IconButton>
                  </Box>
                    {
                      tests
                        .filter(test => test.from_sample === sample.id)
                        .map(test => (
                          <Box key={test.id} sx={{maxWidth: '100%', display: 'flex', flexWrap: 'no-wrap', alignItems: 'flex-start'}}>
                            <TextField
                              id={test.id}
                              value={test.description}
                              type="text"
                              color="primary"
                              variant='filled'
                              label="Test"
                              onChange={e => setTests(tests.map(item => {
                                if(item.id === test.id){
                                  return {...item, description: e.target.value}
                                }
                                return item
                              }))}
                              fullWidth
                              required                            
                              sx={{mb: 4, background: 'darkgray', ml: 6}}
                            />
                            <IconButton
                              size="large"
                              aria-label="delete current test"
                              aria-controls="menu-appbar"
                              aria-haspopup="true"
                              color="error"
                              onClick={() => removeNewTest(null, test.id)}
                            >
                              <DeleteForeverIcon/>
                            </IconButton>
                          </Box>
                        ))
                    }
                    {
                      <Button onClick={() => addNewTest(null, sample.id)} sx={{ml: 6, mb: 4, bgcolor: 'green', color: 'white', fontWeight: 'bold', fontSize: '1rem', '&:hover': {bgcolor: 'darkgreen'}}} fullWidth>Add New Test</Button>
                    }
                </Fragment>
                )
              )                
            }

            {
              <Button onClick={addNewSample} sx={{mb: 4, bgcolor: 'green', color: 'white', fontWeight: 'bold', fontSize: '1rem', '&:hover': {bgcolor: 'darkgreen'}}} fullWidth>Add New Sample</Button>
            }


            <Button variant="contained" color='primary' type="submit" sx={{fontWeight: 'bold', fontSize: '1.2rem'}}>Submit Order</Button>
          </form>
          <small>Already made an order? <Link to="/manage-orders">Find it here</Link></small>
        </Container>
    </>
  )
}