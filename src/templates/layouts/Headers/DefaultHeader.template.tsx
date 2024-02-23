import React from 'react';
import Header, { HeaderLeft, HeaderRight } from '../../../components/layouts/Header/Header';
import SearchPartial from './_partial/Search.partial';

const DefaultHeaderTemplate = () => {
	return (
		<Header>
			<HeaderLeft>
				<SearchPartial />
			</HeaderLeft>

		</Header>
	);
};

export default DefaultHeaderTemplate;
