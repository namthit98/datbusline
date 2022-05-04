import { groupBy, map } from 'lodash';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SidebarLayout from '../components/layouts/SidebarLayout';
import { SERVER_URL } from '../const';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { useRouter } from 'next/router';
import moment from 'moment';

const TicketsPage = () => {
  const router = useRouter();
  const [ticktes, setTickets] = useState(null);

  const cancelTicket = async (ticketId) => {
    fetch(SERVER_URL + `/clients/tickets/${ticketId}/cancel`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('bus_management_client_token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.error) {
          toast.error('Cancel ticket failed.');
          return;
        }
        toast.success('Cancel ticket successfully.');
        fetch(SERVER_URL + '/clients/tickets', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: Cookies.get('bus_management_client_token'),
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data && data.error) {
              Cookies.remove('bus_management_client_token');
              router.push('/');
              return;
            }
            setTickets(data);
          })
          .catch((err) => {
            console.log(err);

            Cookies.remove('bus_management_client_token');
            router.push('/');
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!Cookies.get('bus_management_client_token')) {
      router.push('/');
      return;
    }

    fetch(SERVER_URL + '/clients/tickets', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('bus_management_client_token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.error) {
          Cookies.remove('bus_management_client_token');
          router.push('/');
          return;
        }
        setTickets(data);
      })
      .catch((err) => {
        console.log(err);

        Cookies.remove('bus_management_client_token');
        router.push('/');
      });
  }, []);

  if (!ticktes) return null;

  const ticketsGroup = groupBy(ticktes, 'lineId._id');

  return (
    <Box>
      <Typography variant="h5" sx={{ textAlign: 'center', my: 5 }}>
        Tickets
      </Typography>
      <Box>
        {map(ticketsGroup, (tickets) => {
          const ticket = tickets[0];
          const isOld = moment(ticket?.lineId?.startTime).isBefore(moment());

          return (
            <Paper key={ticket?._id} elevation={3} sx={{ m: 3, p: 3 }}>
              <Typography
                variant="h6"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {ticket?.lineId?.route?.startingPoint}
                &nbsp;&nbsp;&nbsp;
                <ArrowRightAltIcon />
                &nbsp;&nbsp;&nbsp;
                {ticket?.lineId?.route?.destination}
              </Typography>
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                {moment(ticket?.lineId?.startTime).format('DD/MM/YYYY HH:mm')}
                &nbsp;&nbsp;&nbsp;
                <ArrowRightAltIcon />
                &nbsp;&nbsp;&nbsp;
                {moment(ticket?.lineId?.endTime).format('DD/MM/YYYY HH:mm')}
              </Typography>
              <br />
              <Divider />
              <br />
              <Typography>Fullname: {ticket?.fullname}</Typography>
              <Typography>Phone: {ticket?.phone}</Typography>
              <Typography>Number of Tickets: {tickets.length}</Typography>
              <Typography>Status: {ticket?.status?.toUpperCase()}</Typography>
              <br />
              {isOld ? null : (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={cancelTicket.bind(null, ticket._id)}
                >
                  Cancel
                </Button>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

TicketsPage.getLayout = function getLayout(page, token, setToken) {
  return (
    <SidebarLayout token={token} setToken={setToken}>
      {page}
    </SidebarLayout>
  );
};

export default TicketsPage;
