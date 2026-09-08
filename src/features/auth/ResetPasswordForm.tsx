'use client';

import Button from '@atlaskit/button/new';
import { Stack } from '@atlaskit/primitives';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { API } from '@/config/axios';
import { endPoints } from '@/constants/endpoints';

import styles from './Auth.module.css';
import { resetPasswordSchema, type ResetPasswordValues } from './authSchemas';
import { ResetPasswordRequest } from './auth.types';
import PasswordField from './PasswordField';

type ResetPasswordFormProps = {
  /** Single-use token from the reset link, read from the route params. */
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode:"onChange",
    defaultValues: { password: '', confirmPassword: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (reqBody: ResetPasswordRequest) =>
      API.post(endPoints.auth.resetPassword, reqBody),
    onSuccess(data) {
      if (data?.status === 200 || data?.status === 201) {
        router.push('/login');
      }
    },
  });

  const onSubmit = ({ password }: ResetPasswordValues) => {
    mutate({ token, password });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack space='space.200'>
        <PasswordField
          label='New password'
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordField
          label='Confirm new password'
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button
          type='submit'
          appearance='primary'
          shouldFitContainer
          isLoading={isPending}
        >
          Reset password
        </Button>
      </Stack>
    </form>
  );
}
