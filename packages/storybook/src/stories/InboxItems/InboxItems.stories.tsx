import { CalendarIcon, SealIcon, StarIcon } from '@navikt/aksel-icons';
import type { Meta } from '@storybook/react';
import { InboxItem, InboxItems } from 'frontend';
import { useState } from 'react';

const meta = {
  title: 'components/InboxItem/InboxItems',
  component: InboxItems,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: { language: 'tsx' },
    },
  },
} satisfies Meta<typeof InboxItems>;

export default meta;
export const SimpleDesktopExample = () => {
  const [isCheckedFirst, setIsCheckedFirst] = useState(false);
  const [isCheckedSecond, setIsCheckedSecond] = useState(false);
  const [isCheckedThird, setIsCheckedThird] = useState(false);

  return (
    <InboxItems>
      <InboxItem
        title="Har du glemt oss?"
        description="Eksempel på en beskrivelse av en ulest melding"
        sender={{ isCompany: false, name: 'DigDir' }}
        receiver={{ isCompany: false, name: 'Per Person' }}
        tags={[
          { label: '19.01.2024', icon: <CalendarIcon /> },
          { label: 'Viktig!', icon: <SealIcon /> },
        ]}
        checkboxValue="value1"
        isChecked={isCheckedFirst}
        onCheckedChange={() => setIsCheckedFirst(!isCheckedFirst)}
        isUnread
      />
      <InboxItem
        title="Aksjeoppgaven for 2022"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin, nisi vitae auctor accumsan, odio ipsum efficitur nulla, eu tempus sem leo et felis. Curabitur vel varius tortor. Proin semper in nisl eget venenatis. Vestibulum egestas urna id sapien iaculis, id consequat ante varius. Vestibulum vel facilisis nulla. Aenean vitae orci est. Nulla at sagittis mauris. Vestibulum nisl nibh, pulvinar non odio quis, fermentum aliquet tortor. Mauris imperdiet ante lacus. Sed pretium, lorem sed ornare vehicula, neque diam dictum massa, et aliquam lectus metus sit amet nunc. Aliquam erat volutpat. Aliquam ac massa mauris"
        sender={{ isCompany: false, name: 'DigDir' }}
        receiver={{ isCompany: false, name: 'Per Person' }}
        tags={[
          { label: '16.01.2024', icon: <CalendarIcon /> },
          { label: 'Viktig!', icon: <SealIcon /> },
        ]}
        checkboxValue="value2"
        isChecked={isCheckedSecond}
        onCheckedChange={() => setIsCheckedSecond(!isCheckedSecond)}
      />
      <InboxItem
        title="Aksjeoppgaven for 2021"
        description="Integer lacinia ornare ex id consequat. Vivamus condimentum ex vitae elit dignissim convallis. Vivamus nec velit lacus. Vestibulum pharetra pharetra nibh vitae auctor."
        sender={{ isCompany: false, name: 'DigDir' }}
        receiver={{ isCompany: false, name: 'Per Person' }}
        tags={[
          { label: '12.01.2024', icon: <CalendarIcon /> },
          { label: 'Viktig!', icon: <SealIcon /> },
        ]}
        checkboxValue="value2"
        isChecked={isCheckedThird}
        onCheckedChange={() => setIsCheckedThird(!isCheckedThird)}
      />
    </InboxItems>
  );
};
