import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import SidebarLayout from '../components/layouts/SidebarLayout';
import { SERVER_URL } from '../const';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';

const schema = yup.object({
  fullname: yup.string().required('Fullname is required'),
});

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    fetch(SERVER_URL + '/clients/customers', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookies.get('bus_management_client_token'),
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

        setValue('fullname', data?.fullname);
        setValue('email', data?.email);
        setValue('birthday', data?.birthday);
        toast.success('Update profile successfully!');
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
          // Cookies.remove('bus_management_client_token');
          return;
        }
        setValue('fullname', data?.fullname);
        setValue('email', data?.email);
        setValue('birthday', data?.birthday);
        setUser(data);
      })
      .catch((err) => {
        console.log(err);
        // Cookies.remove('bus_management_client_token');
      });
  }, []);

  if (!user) return null;

  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      noValidate
      sx={{
        mt: 1,
        width: {
          xs: '100%',
          md: '50%',
        },
        mx: 'auto',
      }}
    >
      <Typography variant="h5" sx={{ textAlign: 'center', my: 5 }}>
        Profile
      </Typography>
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

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Update
      </Button>
    </Box>
  );
};

ProfilePage.getLayout = function getLayout(page, token, setToken) {
  return (
    <SidebarLayout token={token} setToken={setToken}>
      {page}
    </SidebarLayout>
  );
};

export default ProfilePage;
