import { Box, Button, Container, Typography } from '@mui/material';

export default function LandingPage() {
  return (
    <Container>
      <Box sx={{
        my: 5,
        display: 'flex',
        flexFlow: 'row wrap-reverse',
        alignItems: 'center',
        gap: '5%'
      }} >
        <Box sx={{ flex: '1 1 45%'}}>
          <Typography variant='h3' sx={{color: 'primary.main', my: 1}}>Services</Typography>
          <Typography variant="h2" component="h1" sx={{ my: 1}}>Your Online Lab Flow Solution</Typography>
          <Typography sx={{ my: 1, textWrap: 'balance' }}>Efficient lab management: Intuitive web interface, real-time mobile data entry.</Typography>
          <Button variant="contained">
            <Typography variant="h6" component="span" sx={{ my: 1 }}>Get Started</Typography>
          </Button>
        </Box>
        <Box sx={{ flex: '1 1 50%', textAlign: 'center' }}>
          <Box sx={{ maxWidth: 1, minWidth: 350 }} component="img" src="/imgs/landing-page/hero.webp" alt="Lab Computer and Equipment"/>
        </Box>
      </Box>
      
      <Box sx={{
        my: 5,
        display: 'flex',
        flexFlow: 'row wrap-reverse',
        alignItems: 'center',
        gap: '5%'
      }} >
        <Box sx={{ flex: '1 1 40%'}}>
          <Typography variant="h2" sx={{ my: 1 }}>Efficiency at its Core:</Typography>
          <Typography>LabLIM Online's intuitive and user-friendly interface enhances overall workflow efficiency in your laboratory.</Typography>
        </Box>
        <Box sx={{ flex: '1 1 50%', textAlign: 'center'}}>
          <Box sx={{ maxWidth: 1, borderRadius: 5 }} component="img" src="/imgs/landing-page/efficiency.jpg" alt="Woman working in a lab" />
        </Box>
      </Box>

      <Box sx={{
        my: 5,
        display: 'flex',
        flexFlow: 'row-reverse wrap-reverse',
        alignItems: 'center',
        gap: '5%'
      }} >
        <Box sx={{ flex: '1 1 40%'}}>
          <Typography variant="h2">Data Accuracy Guaranteed:</Typography>
          <Typography>Trust in the accuracy and reliability of your data with LabLIM Online's robust features.</Typography>
        </Box>
        <Box sx={{ flex: '1 1 50%', textAlign: 'center' }}>
          <Box sx={{ maxWidth: 1, borderRadius: 5 }} component="img" src="/imgs/landing-page/accuracy.jpg" alt="micro pipetting in a lab" />
        </Box>
      </Box>
      
      <Box sx={{
        my: 5,
        display: 'flex',
        flexFlow: 'row wrap-reverse',
        alignItems: 'center',
        gap: '5%'
      }} >
        <Box sx={{ flex: '1 1 40%'}}>
          <Typography variant="h2" sx={{ my: 1 }}>Tailored to Your Needs:</Typography>
          <Typography>Unparalleled customization options allow you to adapt LabLIM Online to your lab's unique workflow and processes effortlessly.</Typography>
        </Box>
        <Box sx={{ flex: '1 1 50%', textAlign: 'center' }}>
          <Box sx={{ maxWidth: 1, borderRadius: 5 }} component="img" src="/imgs/landing-page/dna.jpg" alt="DNA" />
        </Box>
      </Box>

      <Box sx={{
        my: 5,
        display: 'flex',
        flexFlow: 'row-reverse wrap-reverse',
        alignItems: 'center',
        gap: '5%'
      }} >
        <Box sx={{ flex: '1 1 40%'}}>
          <Typography variant="h2">Top-Tier Security Measures:</Typography>
          <Typography>Security is our top priority, implementing state-of-the-art measures to protect your data.</Typography>
        </Box>
        <Box sx={{ flex: '1 1 50%', textAlign: 'center' }}>
          <Box sx={{ maxWidth: 1, borderRadius: 5 }} component="img" src="/imgs/landing-page/security.jpg" alt="Security" />
        </Box>
      </Box>

      <Box sx={{
        my: 5,
        display: 'flex',
        flexFlow: 'row wrap-reverse',
        alignItems: 'center',
        gap: '5%'
      }} >
        <Box sx={{ flex: '1 1 40%'}}>
          <Typography variant="h2" sx={{ my: 1 }}>Facilitate Seamless Collaboration:</Typography>
          <Typography>LabLIM Online facilitates seamless collaboration among team members, boosting overall productivity.</Typography>
        </Box>
        <Box sx={{ flex: '1 1 50%', textAlign: 'center' }}>
          <Box sx={{ maxWidth: 1, borderRadius: 5 }} component="img" src="/imgs/landing-page/team.jpg" alt="Lab Team Collaborating" />
        </Box>
      </Box>

      <Box sx={{
        textAlign: 'center', width: {xs: 1, md: 0.6}, m: '0 auto'
      }} >
        <Box sx={{ my: 5}}>
          <Typography variant="h2" sx={{ my: 1 }}>The LIM Solution for Your Lab:</Typography>
          <Typography sx={{ my: 1, textWrap: 'balance' }}>
            Experience the future of streamlined laboratory management with LabLIM Online. LabLIM Online is the ultimate solution for companies striving to bootstrap performance. Sign up now to unlock a new era of efficiency, accuracy, and collaboration in your lab.
          </Typography> 
          <Button variant="contained">
            <Typography variant="h6" component="span" sx={{ my: 1 }}>Get Started</Typography>
          </Button>
        </Box>
      </Box>
    </Container>
  );
}