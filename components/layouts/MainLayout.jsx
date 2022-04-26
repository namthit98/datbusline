import Header from './Header';
import Footer from './Footer';
import { Box } from '@mui/material';

export default function MainLayout({ children, token, setToken }) {
  return (
    <>
      <Header token={token} setToken={setToken} />
      <Box sx={{ my: 2 }}>{children}</Box>
      <Footer />
    </>
  );
}
