import { Header } from '../../../../frontend-design-poc/src/components/Header';
import { Meta } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

const meta = {
	title: 'Example/Header',
	component: Header,
	decorators: [withRouter],
	tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;

export const withNameOnly: () => JSX.Element = () => <Header name="Ola Nordmann" />;

export const withNameAndCompany: () => JSX.Element = () => (
	<Header name="Ola Nordmann" companyName="Aker Solutions AS" />
);
