const renderAmount = (pendingAmount: number, creditedAmount: number) => {
	let text = '';
	let color = '';

	switch (true) {
		case pendingAmount > 0:
			text = `${pendingAmount} Dr`;
			color = 'red';
			break;
		case creditedAmount > 0:
			text = `${creditedAmount} Cr`;
			color = 'green';
			break;
		default:
			text = '0';
			color = '';
			break;
	}

	return { text, color };
};

export default renderAmount;
