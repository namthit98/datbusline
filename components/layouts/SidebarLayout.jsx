import Header from './Header';
import Footer from './Footer';
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Paper,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { useRouter } from 'next/router';

export default function SidebarLayout({ children, token, setToken }) {
  const router = useRouter();

  return (
    <>
      <Header token={token} setToken={setToken} />
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ my: 3 }}>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  bgcolor: 'background.paper',
                }}
              >
                <nav aria-label="secondary mailbox folders">
                  <List>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          router.push('/profile');
                        }}
                      >
                        <ListItemText primary="Account Infomation" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        component="a"
                        onClick={() => {
                          router.push('/change-password');
                        }}
                      >
                        <ListItemText primary="Security" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        component="a"
                        onClick={() => {
                          router.push('/tickets');
                        }}
                      >
                        <ListItemText primary="Tickets" />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </nav>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Paper elevation={3} sx={{ py: 2, my: 3 }}>
              {children}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
