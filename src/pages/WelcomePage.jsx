import { Panel, Stack } from 'rsuite';
import Search from '../components/Search'

export default function WelcomePage() {
  return (
    <Stack direction="column" spacing={20} alignItems="center" style={{ marginTop: 30 }}>
      <Panel shaded bordered bodyFill style={{ display: 'inline-block', textAlign: 'center'}}>
        <Panel>
          <img src="/imgs/logo.png" style={{ maxHeight: 80, minHeight: 30, maxWidth: '80%'}} alt='Lablim Online Logo' />
          <h2>Welcome to Lablim Online!</h2>
          <p>
            Get started by searching for an active order below.
          </p>
          <br/>
          <Search 
            id="searchBar"
            btnMsg="Find Order"
            placeholder="Search for an order using an order id"
          />
        </Panel>
      </Panel>
    </Stack>
  );
}