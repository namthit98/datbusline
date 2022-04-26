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
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers';
import { SERVER_URL } from '../../const';
import { toast } from 'react-toastify';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(6, 'Password is more than 6 characters')
    .required('Password is required'),
  repassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Re-Password must match'),
  fullname: yup.string().required('Fullname is required'),
  phone: yup.number().required('Phone is required'),
});

const Register = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      repassword: '',
      fullname: '',
      email: '',
      phone: '',
      birthday: null,
      identification: '',
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
    fetch(SERVER_URL + '/clients/register', {
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
        toast.success('Register successfully!');
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Button variant="text" sx={{ color: '#fff' }} onClick={handleClickOpen}>
        Register
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>Register</DialogTitle>
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

            <Controller
              name="repassword"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  required
                  label="Re-Password"
                  type="password"
                  error={Boolean(errors.repassword)}
                  helperText={errors?.repassword?.message || ''}
                  {...field}
                />
              )}
            />

            <Controller
              name="fullname"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  required
                  label="Fullname"
                  error={Boolean(errors.fullname)}
                  helperText={errors?.fullname?.message || ''}
                  {...field}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  required
                  label="Phone"
                  error={Boolean(errors.phone)}
                  helperText={errors?.phone?.message || ''}
                  {...field}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  label="Email"
                  error={Boolean(errors.email)}
                  helperText={errors?.email?.message || ''}
                  {...field}
                />
              )}
            />

            <Controller
              name="identification"
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  label="Identification"
                  error={Boolean(errors.identification)}
                  helperText={errors?.identification?.message || ''}
                  {...field}
                />
              )}
            />

            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <DatePicker
                  clearable
                  inputFormat="DD/MM/YYYY"
                  label="Birthday"
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.birthday)}
                      helperText={errors?.birthday?.message || ''}
                      {...params}
                    />
                  )}
                  {...field}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)}>Register</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Register;
