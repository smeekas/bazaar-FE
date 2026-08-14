import { FormTextField } from '@/components/form/FormTextField';
import Button from '@atlaskit/button/new';
import EyeOpenIcon from '@atlaskit/icon/core/eye-open';
import EyeOpenStrikethroughIcon from '@atlaskit/icon/core/eye-open-strikethrough';
import React, { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type PasswordFieldProps = {
  error?: string;
} & UseFormRegisterReturn<'password'>;
function PasswordField({ error, ...rest }: PasswordFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <FormTextField
      label='Password'
      type={passwordVisible ? 'text' : 'password'}
      elemAfterInput={
        <Button
          appearance='subtle'
          onClick={() => setPasswordVisible((prev) => !prev)}
        >
          {!passwordVisible ? (
            <EyeOpenIcon label='eye open' />
          ) : (
            <EyeOpenStrikethroughIcon label='eye close' />
          )}
        </Button>
      }
      autoComplete='new-password'
      error={error}
      {...rest}
    />
  );
}

export default PasswordField;
