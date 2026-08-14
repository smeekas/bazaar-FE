'use client';

import { ErrorMessage, Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { type ComponentPropsWithRef, useId } from 'react';

type FormTextFieldProps = Omit<ComponentPropsWithRef<typeof Textfield>, 'id' | 'isInvalid'> & {
  label: string;
  /** Validation message; its presence also marks the field as invalid. */
  error?: string;
};

/**
 * Design system text field wired for react-hook-form: spread `register(name)` onto it
 * and pass the matching error message.
 */
export function FormTextField({ label, error, ...inputProps }: FormTextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <Box>
      <Label htmlFor={id}>{label}</Label>
      <Textfield
        {...inputProps}
        id={id}
        isInvalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <Box id={errorId}>
          <ErrorMessage>{error}</ErrorMessage>
        </Box>
      )}
    </Box>
  );
}
