'use client';

import Button from '@atlaskit/button/new';
import { Stack, Text } from '@atlaskit/primitives';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { FormTextField } from '@/components/form/FormTextField';
import { API } from '@/config/axios';
import { endPoints } from '@/constants/endpoints';

import styles from './Auth.module.css';
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from './authSchemas';
import { ForgotPasswordRequest } from './auth.types';

export function ForgotPasswordForm() {
  /** Email the link was sent to; set once the request succeeds. */
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (reqBody: ForgotPasswordRequest) =>
      API.post(endPoints.auth.forgotPassword, reqBody),
    onSuccess(data, { email }) {
      if (data?.status === 200 || data?.status === 201) {
        setSentTo(email);
      }
    },
  });

  const onSubmit = ({ email }: ForgotPasswordValues) => {
    mutate({ email });
  };

  if (sentTo) {
    return (
      <Stack space='space.100'>
        <Text>
          We sent a reset link to <strong>{sentTo}</strong>.
        </Text>
        <Text color='color.text.subtlest' size='small'>
          The link expires shortly — check your spam folder if it does not
          arrive.
        </Text>
      </Stack>
    );
  }

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
        <Button
          type='submit'
          appearance='primary'
          shouldFitContainer
          isLoading={isPending}
        >
          Send reset link
        </Button>
      </Stack>
    </form>
  );
}
