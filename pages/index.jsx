import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { DatePicker } from '@mui/x-date-pickers';
import * as moment from 'moment';
import { useState } from 'react';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import MainLayout from '../components/layouts/MainLayout';
import { green } from '@mui/material/colors';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useRouter } from 'next/router';

export default function Home({ routes, startingPointsAndDestinations }) {
  const router = useRouter();
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(moment());

  const handleSearch = () => {
    if (startingPoint && destination && date) {
      router.push(
        '/buy-ticket' +
          `?startingPoint=${startingPoint}&destination=${destination}&date=${date}&step=1`
      );
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          height: { xs: 250, sm: 300, lg: 400 },
          mb: 6,
        }}
      >
        <Image src="/banner.jpeg" alt="banner" layout="fill" />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mb: 10 }}>
        <Grid container spacing={3}>
          <Grid item xs={6} md={4}>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Starting Point
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                label="Starting Point"
                value={startingPoint}
                onChange={(e) => {
                  setStartingPoint(e.target.value);
                }}
              >
                {startingPointsAndDestinations?.startingPoints?.map((x) => {
                  return (
                    <MenuItem key={x} value={x}>
                      {x}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Paper>
          </Grid>

          <Grid item xs={6} md={4}>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Destination
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                label="Destination"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                }}
              >
                {startingPointsAndDestinations?.destinations?.map((x) => {
                  return (
                    <MenuItem key={x} value={x}>
                      {x}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Date
              </Typography>
              <DatePicker
                inputFormat="DD/MM/YYYY"
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} sx={{ m: 'auto' }}>
            <Button fullWidth variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 10 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Dat Busline - Reputation - Quality
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <PeopleAltIcon sx={{ fontSize: 100, color: green[500] }} />
            <Typography variant="h6">More than 20M customers</Typography>
            <Typography>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <LocalGasStationIcon sx={{ fontSize: 100, color: green[500] }} />
            <Typography variant="h6">More than 250 officers</Typography>
            <Typography>
              It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <DirectionsBusIcon sx={{ fontSize: 100, color: green[500] }} />
            <Typography variant="h6">More than 1600 line each day</Typography>
            <Typography>
              Lorem Ipsum passages, and more recently with desktop publishing
              software like Aldus PageMaker including versions of Lorem Ipsum.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 10 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Lines
        </Typography>
        {routes && routes.length ? (
          <Grid container spacing={3}>
            {routes.map((route, index) => {
              return (
                <Grid
                  key={route._id}
                  item
                  xs={12}
                  md={6}
                  sx={{
                    cursor: 'pointer',
                    transition: '0.5s',
                    ':hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={() => {
                    router.push(
                      '/buy-ticket' +
                        `?startingPoint=${route?.startingPoint}&destination=${route?.destination}`
                    );
                  }}
                >
                  <Paper
                    elevation={5}
                    sx={{ display: 'flex', borderRadius: 3 }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        height: 100,
                        width: '30%',
                      }}
                    >
                      <Image
                        src={`/image-${index + 1}.png`}
                        layout="fill"
                        alt=""
                      />
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        height: 100,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ color: green[900], textAlign: 'right', mb: 1 }}
                      >
                        {route.startingPoint} - {route.destination}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <LocationOnIcon />
                          &nbsp;
                          {route.distance}km
                        </Typography>
                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <AccessTimeIcon />
                          &nbsp;
                          {route.timeShift}h
                        </Typography>
                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <ConfirmationNumberIcon />
                          &nbsp;
                          <span style={{ color: green[500] }}>
                            {route.price.toLocaleString('it-IT', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </span>
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ) : null}
      </Paper>
    </Container>
  );
}

Home.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps() {
  const [res1, res2] = await Promise.all([
    fetch(process.env.SERVER_URL + '/clients/routes'),
    fetch(process.env.SERVER_URL + '/clients/starting-points-and-destinations'),
  ]);

  const routes = await res1.json();
  const startingPointsAndDestinations = await res2.json();

  return {
    props: {
      routes: routes.slice(0, 9),
      startingPointsAndDestinations,
    },
  };
}
