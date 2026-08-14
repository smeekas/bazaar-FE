'use client';

import Button from '@atlaskit/button/new';
import { Stack } from '@atlaskit/primitives';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormTextField } from '@/components/form/FormTextField';

import styles from './Auth.module.css';
import { signupSchema, type SignupValues } from './authSchemas';
import PasswordField from './PasswordField';

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  const onSubmit = async ({ email }: SignupValues) => {
    // TODO: replace with the real sign-up request.
    console.log('Signing up', email);
    console.log(errors);
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack space='space.200'>
        <FormTextField
          label='Username'
          autoComplete='username'
          placeholder='unique username'
          error={errors.username?.message}
          {...register('username')}
        />
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
          Create account
        </Button>
      </Stack>
    </form>
  );
}
