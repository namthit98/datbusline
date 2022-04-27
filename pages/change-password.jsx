import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import SidebarLayout from '../components/layouts/SidebarLayout';
import { SERVER_URL } from '../const';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const schema = yup.object({
  password: yup
    .string()
    .min(6, 'Password is more than 6 characters')
    .required('Password is required'),
  newpassword: yup
    .string()
    .min(6, 'Password is more than 6 characters')
    .required('New Password is required'),
  renewpassword: yup
    .string()
    .oneOf([yup.ref('newpassword'), null], 'Re-new Passwords must match'),
});

const ChangePasswordPage = () => {
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      newpassword: '',
      renewpassword: '',
    },
  });

  const onSubmit = (data) => {
    fetch(SERVER_URL + '/clients/change-password', {
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
        toast.success('Change password successfully!');
        reset();
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
  }, []);

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
        Change password
      </Typography>
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
        name="newpassword"
        control={control}
        render={({ field }) => (
          <TextField
            size="small"
            fullWidth
            required
            margin="normal"
            label="New Password"
            type="password"
            error={Boolean(errors.newpassword)}
            helperText={errors?.newpassword?.message || ''}
            {...field}
          />
        )}
      />

      <Controller
        name="renewpassword"
        control={control}
        render={({ field }) => (
          <TextField
            size="small"
            margin="normal"
            fullWidth
            required
            label="Re-new Password"
            type="password"
            error={Boolean(errors.renewpassword)}
            helperText={errors?.renewpassword?.message || ''}
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

ChangePasswordPage.getLayout = function getLayout(page, token, setToken) {
  return (
    <SidebarLayout token={token} setToken={setToken}>
      {page}
    </SidebarLayout>
  );
};

export default ChangePasswordPage;
