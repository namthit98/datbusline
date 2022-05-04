import * as yup from 'yup';
import Cookies from 'js-cookie';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers';
import { SERVER_URL } from '../../const';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useEffect } from 'react';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(6, 'Password is more than 6 characters')
    .required('Password is required'),
});

const Login = ({ setToken }) => {
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setFocus,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = (data) => {
    fetch(SERVER_URL + '/clients/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.error) {
          toast.error(data.message);
          toast.clearWaitingQueue();
          return;
        }
        Cookies.set('bus_management_client_token', data?.token);
        setToken(data?.token);
        toast.success('Login successfully!');
        handleClose();

        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (open && setFocus) {
      setTimeout(() => {
        setFocus('username');
      }, 200);
    }
  }, [open, setFocus]);

  return (
    <>
      <Button variant="text" sx={{ color: '#fff' }} onClick={handleClickOpen}>
        Login
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <Box
            onSubmit={handleSubmit(onSubmit)}
            component="form"
            noValidate
            sx={{
              maxWidth: 400,
            }}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  required
                  label="Username"
                  error={Boolean(errors.username)}
                  helperText={errors?.username?.message || ''}
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  required
                  label="Password"
                  type="password"
                  error={Boolean(errors.password)}
                  helperText={errors?.password?.message || ''}
                  {...field}
                />
              )}
            />

            <Button type="submit" hidden></Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)}>Login</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
