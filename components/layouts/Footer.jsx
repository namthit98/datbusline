import { Container, Divider, Grid, Paper, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
          Dat Busline
        </Typography>
        <Grid container>
          <Grid item xs={12} md={8} sx={{ mb: { xs: 3, md: 0 } }}>
            <Typography>Phone: 099999999</Typography>
            <Typography>Email: datbus@gmail.com</Typography>
            <Typography>Address: 69 Tran Duy Hung, ha Noi</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>Quy định chung</Typography>
            <Typography>Hướng dẫn đặt vé</Typography>
            <Typography>Hướng dẫn tra cứu vé</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Footer;
