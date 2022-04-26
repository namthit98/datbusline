import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../const';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [token, setToken] = useState();
  const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
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
          return;
        }
        setToken(Cookies.get('bus_management_client_token'));
      })
      .catch((err) => {
        console.log(err);
        Cookies.remove('bus_management_client_token');
      });
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ToastContainer limit={3} />
      {getLayout(<Component {...pageProps} />, token, setToken)}
    </LocalizationProvider>
  );
}

export default MyApp;
