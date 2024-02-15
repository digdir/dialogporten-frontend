import { Header } from 'frontend-design-poc';
import { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
	title: 'Components/Header',
	component: Header,
	decorators: [withRouter],
	parameters: {
		layout: 'fullscreen',
	},
} as Meta<typeof Header>;

export const Default: StoryObj<typeof Header> = {
	args: {
		name: 'Ola Nordmann',
	},
};

export const WithCompanyName: StoryObj<typeof Header> = {
	args: {
		name: 'Ola Nordmann',
		companyName: 'Aker Solutions AS',
	},
};
