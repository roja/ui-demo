import React, { Component } from 'react';

import { Box, Heading, Icon, TextBlock, TextInline } from 'zbase';
import { Link } from 'z-frontend-elements';

// NOTE: this story must include references to all fonts (normal, bold, icon) so they're loaded immediately
// not doing so results in flakiness in Chromatic visual tests for components like Chart and Tooltip
class StorybookIntroduction extends Component<{ totalComponents: number }> {
  render() {
    const { totalComponents } = this.props;
    return (
      <Box bg="grayscale.white" height={1} p={5}>
        <Heading level={2} mb={2}>
          Welcome to our storybook <Icon iconName="check-circle" />
        </Heading>
        <TextBlock>
          We have examples for{' '}
          <TextInline bold tag="strong">
            {totalComponents}
          </TextInline>{' '}
          components.{' '}
          <Link href="http://ui.zenefits.com" target="_blank">
            View docs
          </Link>
        </TextBlock>
      </Box>
    );
  }
}

export default StorybookIntroduction;
