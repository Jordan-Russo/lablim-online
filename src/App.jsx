import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import RootLayout from './components/RootLayout';
import Login from './pages/Login';
import Logout from './pages/Logout';
import LandingPage from './pages/LandingPage';
import OwnedOrganizations from './pages/OwnedOrganizations';
import OrganizationDetails from './pages/OrganizationDetails';
import CreateNewOrganization from './pages/CreateNewOrganization';
import CreateNewOrder from './pages/CreateNewOrder';
import OwnedOrders from './pages/OwnedOrders'
import OrderDetails from './pages/OrderDetails'
import SampleDetails from './pages/SampleDetails'
import TestReport from './pages/TestReport'
import CreateName from './pages/CreateName'
import ReceivingOrganizations from './pages/ReceivingOrganizations'
import IncomingOrders from './pages/IncomingOrders';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

let theme = createTheme({
  palette: {
		mode: 'dark',
    primary: {
      main: '#0052cc',
    },
    secondary: {
      main: '#edf2ff',
    },
    tertiary: {
      main: '#00beef',
    },
  },
	typography: {
		h1: {
			fontSize: "3rem",
			fontWeight: 600,
		},
		h2: {
			fontSize: "1.75rem",
			fontWeight: 600
		}, 
		h3: {
			fontSize: "1.5rem",
			fontWeight: 600,
		}
	},
	image: {
    maxWidth: '100%',
    height: 'auto',
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <RootLayout>
            <Routes>
              <Route exact path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route
                path="/create-new-organization"
                element={
                  <ProtectedRoute>
                    <CreateNewOrganization />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/manage-organization"
                element={
                  <ProtectedRoute>
                    <OwnedOrganizations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-organization/:organizationID"
                element={
                  <ProtectedRoute>
                    <OrganizationDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/create-new-order"
                element={
                  <ProtectedRoute>
                    <CreateNewOrder />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/manage-order"
                element={
                  <ProtectedRoute>
                    <OwnedOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-order/:orderID"
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-sample/:sampleID"
                element={
                  <ProtectedRoute>
                    <SampleDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test-report/:orderID"
                element={
                  <ProtectedRoute>
                    <TestReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-name"
                element={
                  <ProtectedRoute>
                    <CreateName />
                  </ProtectedRoute>
                }
              />             
              <Route
                path="/incoming-orders"
                element={
                  <ProtectedRoute>
                    <ReceivingOrganizations />
                  </ProtectedRoute>
                }
              />             
              <Route
                path="/incoming-orders/:organizationID"
                element={
                  <ProtectedRoute>
                    <IncomingOrders />
                  </ProtectedRoute>
                }
              />             
            </Routes>
          </RootLayout>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}