import { Header, HeaderProps } from '../../../../frontend-design-poc/src/components/Header/Header';
import { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
	title: 'Components/Header',
	component: Header,
	decorators: [withRouter],
	parameters: {
		layout: 'fullscreen',
	},
} as Meta<HeaderProps>;

export const Default: StoryObj<HeaderProps> = {
	args: {
		name: 'Ola Nordmann',
	},
};

export const WithCompanyName: StoryObj<HeaderProps> = {
	args: {
		name: 'Ola Nordmann',
		companyName: 'Aker Solutions AS',
	},
};
