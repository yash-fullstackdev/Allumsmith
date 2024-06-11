const renderAmount = (
	pendingAmount: number,
	creditedAmount: number,
	colorPending?: string,
	colorCredit?: string,
) => {
	let text = '';
	let color = '';

	switch (true) {
		case pendingAmount > 0:
			text = `${pendingAmount} Dr`;
			color = colorPending || 'red';
			break;
		case creditedAmount > 0:
			text = `${creditedAmount} Cr`;
			color = colorCredit || 'green';
			break;
		default:
			text = '0';
			color = '';
			break;
	}

	return { text, color };
};

export default renderAmount;
