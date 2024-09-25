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
        summary="Eksempel på en beskrivelse av en ulest melding"
        sender={{ isCompany: false, name: 'DigDir' }}
        receiver={{ isCompany: false, name: 'Per Person' }}
        metaFields={[
          { type: 'status_NEW', label: 'Status: New' },
          { type: 'timestamp', label: '5. september 15.40' },
          {
            type: 'seenBy',
            label: 'Sett av deg',
            options: { tooltip: 'This is seen by \n Every person will be listed here' },
          },
        ]}
        checkboxValue="value1"
        isChecked={isCheckedFirst}
        onCheckedChange={() => setIsCheckedFirst(!isCheckedFirst)}
        isUnread
      />
      <InboxItem
        title="Aksjeoppgaven for 2022"
        summary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin, nisi vitae auctor accumsan, odio ipsum efficitur nulla, eu tempus sem leo et felis. Curabitur vel varius tortor. Proin semper in nisl eget venenatis. Vestibulum egestas urna id sapien iaculis, id consequat ante varius. Vestibulum vel facilisis nulla. Aenean vitae orci est. Nulla at sagittis mauris. Vestibulum nisl nibh, pulvinar non odio quis, fermentum aliquet tortor. Mauris imperdiet ante lacus. Sed pretium, lorem sed ornare vehicula, neque diam dictum massa, et aliquam lectus metus sit amet nunc. Aliquam erat volutpat. Aliquam ac massa mauris"
        sender={{ isCompany: false, name: 'DigDir' }}
        receiver={{ isCompany: false, name: 'Per Person' }}
        metaFields={[
          { type: 'timestamp', label: '5. september 15:40' },
          { type: 'status_REQUIRES_ATTENTION', label: 'Viktig!' },
        ]}
        checkboxValue="value2"
        isChecked={isCheckedSecond}
        onCheckedChange={() => setIsCheckedSecond(!isCheckedSecond)}
      />
      <InboxItem
        title="Aksjeoppgaven for 2021"
        summary="Integer lacinia ornare ex id consequat. Vivamus condimentum ex vitae elit dignissim convallis. Vivamus nec velit lacus. Vestibulum pharetra pharetra nibh vitae auctor."
        sender={{ isCompany: false, name: 'DigDir' }}
        receiver={{ isCompany: false, name: 'Per Person' }}
        metaFields={[
          { type: 'timestamp', label: '12.01.2024' },
          { type: 'status_REQUIRES_ATTENTION', label: 'Viktig!' },
        ]}
        checkboxValue="value2"
        isChecked={isCheckedThird}
        onCheckedChange={() => setIsCheckedThird(!isCheckedThird)}
      />
      <InboxItem
        title="En melding som er in progress"
        summary="Integer lacinia ornare ex id consequat. Vivamus condimentum ex vitae elit dignissim convallis. Vivamus nec velit lacus. Vestibulum pharetra pharetra nibh vitae auctor."
        sender={{ isCompany: false, name: 'DigDir' }}
        receiver={{ isCompany: false, name: 'Per Person' }}
        metaFields={[
          { type: 'status_IN_PROGRESS', label: 'Status: In Progress' },
          { type: 'timestamp', label: '5. september 15.40' },
          {
            type: 'seenBy',
            label: 'Sett av deg',
            options: { tooltip: 'This is seen by \n Every person will be listed here' },
          },
        ]}
        checkboxValue="value2"
        isChecked={isCheckedThird}
        onCheckedChange={() => setIsCheckedThird(!isCheckedThird)}
      />
      <InboxItem
        title="En melding som krever handling"
        summary="Integer lacinia ornare ex id consequat. Vivamus condimentum ex vitae elit dignissim convallis. Vivamus nec velit lacus. Vestibulum pharetra pharetra nibh vitae auctor."
        sender={{ isCompany: false, name: 'DigDir' }}
        receiver={{ isCompany: false, name: 'Per Person' }}
        metaFields={[
          { type: 'status_REQUIRES_ATTENTION', label: 'Viktig!' },
          { type: 'timestamp', label: '5. september 15.40' },
          {
            type: 'seenBy',
            label: 'Sett av deg',
            options: { tooltip: 'This is seen by \n Every person will be listed here' },
          },
        ]}
        checkboxValue="value2"
        isChecked={isCheckedThird}
        onCheckedChange={() => setIsCheckedThird(!isCheckedThird)}
      />
      <InboxItem
        title="En ny melding"
        summary="Integer lacinia ornare ex id consequat. Vivamus condimentum ex vitae elit dignissim convallis. Vivamus nec velit lacus. Vestibulum pharetra pharetra nibh vitae auctor."
        sender={{ isCompany: false, name: 'DigDir' }}
        receiver={{ isCompany: false, name: 'Per Person' }}
        metaFields={[{ type: 'status_NEW', label: 'Status: New' }]}
        checkboxValue="value2"
        isChecked={isCheckedThird}
        onCheckedChange={() => setIsCheckedThird(!isCheckedThird)}
      />
      <InboxItem
        title="En melding som er sendt"
        summary="Integer lacinia ornare ex id consequat. Vivamus condimentum ex vitae elit dignissim convallis. Vivamus nec velit lacus. Vestibulum pharetra pharetra nibh vitae auctor."
        sender={{ isCompany: false, name: 'DigDir' }}
        receiver={{ isCompany: false, name: 'Per Person' }}
        metaFields={[
          { type: 'status_SENT', label: 'Status: Sent' },
          { type: 'timestamp', label: '5. september 15.40' },
        ]}
        checkboxValue="value2"
        isChecked={isCheckedThird}
        onCheckedChange={() => setIsCheckedThird(!isCheckedThird)}
      />
      <InboxItem
        title="En melding som er et utkast"
        summary="Integer lacinia ornare ex id consequat. Vivamus condimentum ex vitae elit dignissim convallis. Vivamus nec velit lacus. Vestibulum pharetra pharetra nibh vitae auctor."
        sender={{ isCompany: false, name: 'DigDir' }}
        receiver={{ isCompany: false, name: 'Per Person' }}
        metaFields={[
          { type: 'status_DRAFT', label: 'Status: Draft' },
          { type: 'timestamp', label: '5. september 15.40' },
        ]}
        checkboxValue="value2"
        isChecked={isCheckedThird}
        onCheckedChange={() => setIsCheckedThird(!isCheckedThird)}
      />
      <InboxItem
        title="En melding som har vedlegg"
        summary="Integer lacinia ornare ex id consequat. Vivamus condimentum ex vitae elit dignissim convallis. Vivamus nec velit lacus. Vestibulum pharetra pharetra nibh vitae auctor."
        sender={{ isCompany: false, name: 'DigDir' }}
        receiver={{ isCompany: false, name: 'Per Person' }}
        metaFields={[
          { type: 'status_NEW', label: 'Status: New' },
          { type: 'attachment', label: '3' },
          {
            type: 'seenBy',
            label: 'Sett av deg',
            options: { tooltip: 'This is seen by \n Every person will be listed here' },
          },
        ]}
        checkboxValue="value2"
        isChecked={isCheckedThird}
        onCheckedChange={() => setIsCheckedThird(!isCheckedThird)}
      />
    </InboxItems>
  );
};
