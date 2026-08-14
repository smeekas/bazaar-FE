'use client';

import Button from '@atlaskit/button/new';
import { Stack } from '@atlaskit/primitives';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormTextField } from '@/components/form/FormTextField';

import styles from './Auth.module.css';
import { loginSchema, type LoginValues } from './authSchemas';
import PasswordField from './PasswordField';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async ({ email }: LoginValues) => {
    // TODO: replace with the real sign-in request.
    console.log('Logging in', email);
  };
  console.log(errors);
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
        <Button
          type='submit'
          appearance='primary'
          shouldFitContainer
          isLoading={isSubmitting}
        >
          Log in
        </Button>
      </Stack>
    </form>
  );
}
