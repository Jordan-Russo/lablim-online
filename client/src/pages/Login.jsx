import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Container } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { supabaseClient as supabase } from '../config/supabase-client';
import {useAuth} from '../../src/hooks/Auth'

export default function Login() {
  const {session} = useAuth()

  if (!session) {
    return (
      <Container style={{marginTop: 40}}>
        <Auth supabaseClient={supabase} appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'red',
                brandAccent: 'darkred',
                inputText: 'white'
              },
            },
          },
          }} 
          providers={[]} 
          socialLayout="horizontal"
        />
      </Container>
    )
  }
  else {
    return <Navigate replace to="/getting-started" />
  }
}