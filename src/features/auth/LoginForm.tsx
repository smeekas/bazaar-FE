'use client';

import Button from '@atlaskit/button/new';
import { Stack, Text } from '@atlaskit/primitives';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormTextField } from '@/components/form/FormTextField';

import { AuthLink } from './AuthLink';
import styles from './Auth.module.css';
import { loginSchema, type LoginValues } from './authSchemas';
import PasswordField from './PasswordField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/config/axios';
import { endPoints, routeHandlerEndpoint } from '@/constants/endpoints';
import { LoginRequest } from './auth.types';
import { useRouter } from 'next/navigation';
import axios, { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { toastMessage } from '@/constants/messages';
import { routes } from '@/constants/routes';

export function LoginForm() {
  const router = useRouter();
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'smeet.k@simformsolutions.com',
      password: 'Hiral16@B',
    },
  });
  const { mutate, isPending, error } = useMutation({
    mutationFn: (reqBody: LoginRequest) =>
      axios.post(routeHandlerEndpoint.login, reqBody),
    onSuccess(data) {
      if (data.status === 201) {
        qc.invalidateQueries({ queryKey: ['profile'] });
        router.push(routes.profile);
      } else {
        toast.error(toastMessage.somethingWentWrong);
      }
    },

    onError(err) {
      if (isAxiosError(err)) {
        toast.error(toastMessage.somethingWentWrong);
      }
    },
  });
  const onSubmit = async ({ email, password }: LoginValues) => {
    mutate({ email, password });
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack space='space.200'>
        <FormTextField
          label='Email'
          type='email'
          autoComplete='email'
          placeholder='you@example.com'
          error={errors.email?.message}
          {...register('email')}
        />
        <PasswordField
          error={errors.password?.message}
          {...register('password')}
        />
        <Text align='end' size='small'>
          <AuthLink href='/forgot-password'>Forgot password?</AuthLink>
        </Text>
        <Button
          type='submit'
          appearance='primary'
          shouldFitContainer
          isLoading={isPending}
        >
          Log in
        </Button>
      </Stack>
    </form>
  );
}
