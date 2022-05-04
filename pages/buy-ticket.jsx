import { useState } from 'react';
import qs from 'query-string';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import * as moment from 'moment';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import MainLayout from '../components/layouts/MainLayout';
import { DatePicker } from '@mui/x-date-pickers';
import { useEffect } from 'react';
import useSWR from 'swr';
import CircleIcon from '@mui/icons-material/Circle';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { uniq } from 'lodash';

const steps = [
  'Select Route',
  'Line Information',
  'Ticket Information',
  'Successfully',
];

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function BuyTicket({
  startingPointsAndDestinations,
  SERVER_URL,
}) {
  const router = useRouter();
  const [numberOfTickets, setNumberOfTickets] = useState(0);
  const [startingPoint, setStartingPoint] = useState(
    router?.query?.startingPoint || ''
  );
  const [destination, setDestination] = useState(
    router?.query?.destination || ''
  );
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [date, setDate] = useState(
    router?.query?.date ? moment(new Date(router.query.date)) : moment()
  );
  const [activeStep, setActiveStep] = useState(
    parseInt(router?.query?.step || 0)
  );
  const [skipped, setSkipped] = useState(new Set([]));
  const [selectedLine, setSelectedLine] = useState(null);
  const [priceSorting, setPriceSorting] = useState('');
  const [types, setTypes] = useState([]);
  const [type, setType] = useState('');
  const { data, error } = useSWR(
    activeStep === 1 && startingPoint && destination && date
      ? ['lines', priceSorting, type, startingPoint, destination, date]
      : null,
    () =>
      fetch(
        SERVER_URL +
          '/clients/lines' +
          `?${qs.stringify({
            price_sort: priceSorting,
            type,
            startingPoint,
            destination,
            date,
          })}`
      ).then((res) => res.json())
  );

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    if (activeStep === 1) {
      setSelectedLine(null);
      setNumberOfTickets(0);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSearch = () => {
    if (startingPoint && destination && date) {
      router.push(
        '/buy-ticket' +
          `?startingPoint=${startingPoint}&destination=${destination}&date=${date}`
      );
      handleNext();
    }
  };

  const handleSelectLine = (line) => {
    setSelectedLine(line);
  };

  const handleBook = () => {
    if (numberOfTickets < 1 || numberOfTickets > 9) {
      toast.error('Number of tickets is more than 0 and less than 10');
      toast.clearWaitingQueue();
      return;
    }

    const line = data.find((x) => x._id === selectedLine?._id);
    if (line && line.coach.seats - line.tickets.length < numberOfTickets) {
      toast.error('Out of seats');
      toast.clearWaitingQueue();
      return;
    }

    setActiveStep(2);
  };

  const handleConfirm = () => {
    if (!fullname) {
      toast.error('Fullname is required');
      toast.clearWaitingQueue();
      return;
    }

    if (!phone) {
      toast.error('Phone is required');
      toast.clearWaitingQueue();
      return;
    }

    fetch(SERVER_URL + '/clients/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullname,
        phone,
        email,
        customer: customerId,
        numberOfTickets: parseInt(numberOfTickets),
        lineId: selectedLine._id,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data && data.error) {
          toast.error(data.message || 'Create ticket failed!');
          toast.clearWaitingQueue();
          return;
        }

        setActiveStep(3);
        setSelectedLine(null);
        setNumberOfTickets(0);
        setFullname('');
        setPhone('');
        setEmail('');
        setCustomerId('');
      })
      .catch((err) => {
        toast.error('Create ticket failed!');
        toast.clearWaitingQueue();
      });
  };

  useEffect(() => {
    const queries = qs.stringify({ startingPoint, destination, date });

    router.push(`/buy-ticket?${queries}`);
  }, [startingPoint, destination, date]);

  useEffect(() => {
    fetch(SERVER_URL + '/clients/coaches/types', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.error) {
          return;
        }

        setTypes(data);
      })
      .catch((err) => {
        console.log(err);
      });

    if (!Cookies.get('bus_management_client_token')) return;

    fetch(SERVER_URL + '/clients/token/valid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: Cookies.get('bus_management_client_token'),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.error) {
          Cookies.remove('bus_management_client_token');
          router.push('/');
          return;
        }

        setCustomerId(data?._id || '');
        setFullname(data?.fullname || '');
        setPhone(data?.phone || '');
        setEmail(data?.email || '');
      })
      .catch((err) => {
        console.log(err);
        Cookies.remove('bus_management_client_token');
        router.push('/');
      });
  }, []);

  // const types = data?.reduce((result, current) => {
  //   return [...result, current?.coach?.type];
  // }, []);

  return (
    <Container maxWidth="lg">
      {activeStep === 0 ? (
        <Typography variant="h4">Select Lines</Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5">{startingPoint}</Typography>
            &nbsp;&nbsp;&nbsp;
            <ArrowRightAltIcon />
            &nbsp;&nbsp;&nbsp;
            <Typography variant="h5">{destination}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>
              {selectedLine
                ? moment(selectedLine?.startTime).format('HH:mm')
                : ''}
            </Typography>
            &nbsp;&nbsp;&nbsp;
            <Typography>{date?.format('DD/MM/YYYY')}</Typography>
          </Box>
        </>
      )}
      <br />
      <br />
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <br />
        {activeStep === 1 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={2}>
              <TextField
                size="small"
                select
                fullWidth
                label="Price"
                value={priceSorting}
                onChange={(e) => setPriceSorting(e.target.value)}
              >
                <MenuItem value={''}>Price</MenuItem>
                <MenuItem value={'asc'}>ASC</MenuItem>
                <MenuItem value={'desc'}>DESC</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                size="small"
                select
                fullWidth
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value={''}>Type</MenuItem>
                {uniq(types).map((x, index) => {
                  return (
                    <MenuItem key={index} value={x}>
                      {x}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
            {/* <Grid item xs={12} md={2}>
              <TextField size="small" select required fullWidth label="Route">
                <MenuItem value={''}>all</MenuItem>
              </TextField>
            </Grid> */}
          </Grid>
        ) : null}
        <br />
        <br />

        {activeStep === 0 ? (
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
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
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
        ) : null}

        {activeStep === 1 ? (
          <>
            {!error && !data ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : null}

            {data && data.length
              ? data.map((line) => {
                  return (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 2,
                        borderColor:
                          line._id === selectedLine?._id ? '#1565c0' : '',
                        cursor: 'pointer',
                      }}
                      key={line._id}
                      onClick={handleSelectLine.bind(null, line)}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <Typography variant="h4">
                          {moment(line?.startTime).format('HH:mm')}
                        </Typography>
                        &nbsp;&nbsp;&nbsp;
                        <ArrowRightAltIcon />
                        &nbsp;&nbsp;&nbsp;
                        <Typography variant="h4">
                          {moment(line?.endTime).format('HH:mm')}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Chip
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography sx={{ mr: 2 }}>
                                {line?.route?.price?.toLocaleString('it-IT', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </Typography>
                              <CircleIcon sx={{ fontSize: 5, mr: 2 }} />
                              <Typography sx={{ mr: 2 }}>
                                {line?.coach?.type}
                              </Typography>
                              <CircleIcon sx={{ fontSize: 5, mr: 2 }} />
                              <Typography sx={{ mr: 2 }}>
                                Còn {line?.coach?.seats - line.tickets.length}{' '}
                                chỗ
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>
                      <Typography>
                        Pickup at: {line?.route.pickupPoint}
                      </Typography>
                      <Typography>
                        Dropoff at: {line?.route.dropoffPoint}
                      </Typography>
                      {line._id === selectedLine?._id ? (
                        <>
                          <br />
                          <Divider />
                          <br />

                          {line?.coach?.seats - line.tickets.length <= 0 ? (
                            <Typography variant="h6" sx={{ color: 'red' }}>
                              Out of seats
                            </Typography>
                          ) : (
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Box>
                                <TextField
                                  autoFocus
                                  size="small"
                                  type="number"
                                  max={10}
                                  min={1}
                                  sx={{ mb: 1 }}
                                  value={numberOfTickets}
                                  onChange={(e) =>
                                    setNumberOfTickets(e.target.value)
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        tickets
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                                <Typography>
                                  Total:{' '}
                                  {(
                                    numberOfTickets * line?.route?.price
                                  ).toLocaleString('it-IT', {
                                    style: 'currency',
                                    currency: 'VND',
                                  })}
                                </Typography>
                              </Box>

                              <Button
                                variant="contained"
                                onClick={handleBook}
                                sx={{ alignSelf: 'end' }}
                              >
                                Book
                              </Button>
                            </Box>
                          )}
                        </>
                      ) : null}
                    </Paper>
                  );
                })
              : null}
          </>
        ) : null}

        {activeStep === 2 ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ textAlign: 'center', mb: 5 }}>
                    Customer Information
                  </Typography>
                  <TextField
                    required
                    size="small"
                    fullWidth
                    label="Fullname"
                    sx={{ mb: 2 }}
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                  <TextField
                    required
                    size="small"
                    fullWidth
                    label="Phone"
                    sx={{ mb: 2 }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    label="Email"
                    sx={{ mb: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ textAlign: 'center', mb: 5 }}>
                    Line Information
                  </Typography>
                  <Typography variant="h6">Tuyến xe</Typography>
                  <Typography>
                    {selectedLine?.route?.startingPoint}
                    &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
                    {selectedLine?.route?.destination}
                  </Typography>
                  <br />
                  <Typography variant="h6">Thời gian</Typography>
                  <Typography>
                    {moment(selectedLine?.startTime).format('DD/MM/YYYY HH:mm')}
                    &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
                    {moment(selectedLine?.endTime).format('DD/MM/YYYY HH:mm')}
                  </Typography>
                  <br />
                  <Typography variant="h6">Seats</Typography>
                  <Typography>{numberOfTickets}</Typography>
                  <br />
                  <Typography variant="h6">Pickup at</Typography>
                  <Typography>{numberOfTickets}</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Box
                    sx={{
                      width: '50%',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">
                      {(
                        selectedLine?.route?.price * numberOfTickets
                      ).toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        ) : null}

        {activeStep === 3 ? (
          <>
            <Alert variant="filled" severity="success">
              Book successfully. Thank you!
            </Alert>
          </>
        ) : null}

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            mt: 3,
          }}
        >
          {activeStep === 3 ? (
            <Button
              color="secondary"
              variant="outlined"
              disabled={activeStep === 0}
              onClick={() => router.push('/')}
              fullWidth
              sx={{
                mr: { xs: 0, md: activeStep === 2 ? 2 : 0 },
                mb: { xs: 2, md: 0 },
              }}
            >
              Go to homepage
            </Button>
          ) : null}
          {activeStep !== 3 && activeStep !== 0 ? (
            <Button
              color="secondary"
              variant="outlined"
              onClick={handleBack}
              fullWidth
              sx={{
                mr: { xs: 0, md: activeStep === 2 ? 2 : 0 },
                mb: { xs: 2, md: 0 },
              }}
            >
              Back
            </Button>
          ) : null}

          {activeStep === 2 ? (
            <Button
              color="primary"
              variant="contained"
              disabled={activeStep === 0}
              onClick={handleConfirm}
              fullWidth
              sx={{ ml: { xs: 0, md: 2 }, mb: { xs: 2, md: 0 } }}
            >
              Confirm
            </Button>
          ) : null}
        </Box>
      </Box>
    </Container>
  );
}

BuyTicket.getLayout = function getLayout(page, token, setToken) {
  return (
    <MainLayout token={token} setToken={setToken}>
      {page}
    </MainLayout>
  );
};

export async function getServerSideProps() {
  const [res1] = await Promise.all([
    fetch(process.env.SERVER_URL + '/clients/starting-points-and-destinations'),
  ]);

  const startingPointsAndDestinations = await res1.json();

  return {
    props: {
      SERVER_URL: process.env.SERVER_URL,
      startingPointsAndDestinations,
    },
  };
}
