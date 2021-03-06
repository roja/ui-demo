import React, { Component } from 'react';
import { getIn, Field, FieldProps } from 'formik';

import FormFieldWrapper, { getErrorId, getLabelId, FormFieldProps } from '../FormFieldWrapper';
import PercentageInput, { PercentageInputProps } from '../../percentage-input/PercentageInput';

type FormPercentageInputProps = PercentageInputProps & FormFieldProps;

class FormPercentageInput extends Component<FormPercentageInputProps> {
  render() {
    const { name, label, containerProps, optional, ...rest } = this.props;
    return (
      <Field
        name={name}
        render={({ field, form }: FieldProps) => {
          const error: any = getIn(form.touched, name) && getIn(form.errors, name);
          return (
            <FormFieldWrapper
              name={name}
              label={label}
              error={error}
              containerProps={containerProps}
              optional={optional}
            >
              <PercentageInput
                id={name}
                {...field}
                {...rest}
                hasError={Boolean(error)}
                aria-labelledby={getLabelId(name)}
                aria-describedby={error ? getErrorId(name) : null}
                mb={0}
              />
            </FormFieldWrapper>
          );
        }}
      />
    );
  }
}

export default FormPercentageInput;
