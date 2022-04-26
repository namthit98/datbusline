import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ToastContainer limit={3} />
      {getLayout(<Component {...pageProps} />)}
    </LocalizationProvider>
  );
}

export default MyApp;
