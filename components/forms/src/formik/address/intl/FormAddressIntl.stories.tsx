import React from 'react';

import { Box } from 'zbase';

import { storiesOf } from '../../../../.storybook/storyHelpers';
import DefaultExample from './exampleDefault';
import SupportedCountryExample from './exampleSupportedCountry';
import UnsupportedCountryExample from './exampleUnsupportedCountry';
import ValidationExample from './exampleValidation';
import ValidationTriggeredExample from './exampleValidationTriggered';
import NoStateExample from './exampleNoState';
import AutocompleteExample from './exampleAutocomplete';
// import OptionalFieldsExample from './exampleOptionalFields';

storiesOf('forms|Form.AddressIntl', module)
  .addDecorator((getStory: Function) => (
    <Box p={20} w={[1, 1 / 2]} bg="grayscale.white">
      {getStory()}
    </Box>
  ))
  .add('basic', DefaultExample)
  .add('autocomplete', AutocompleteExample)
  .add('with value (CA)', SupportedCountryExample)
  .add('with value (BH)', UnsupportedCountryExample)
  .add('with validation', ValidationExample)
  .add('with validation (state optional)', NoStateExample)
  .add('with validation (open)', ValidationTriggeredExample); // for visual regression
// .add('with name, without line 2', OptionalFieldsExample)
