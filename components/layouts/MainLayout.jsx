import Header from './Header';
import Footer from './Footer';
import { Box } from '@mui/material';

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <Box sx={{ my: 2 }}>{children}</Box>
      <Footer />
    </>
  );
}
