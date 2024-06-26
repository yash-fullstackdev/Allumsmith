import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import { Link } from 'react-router-dom';

const CustomerDetailsCanvas = ({ customerDetails }: any) => {
	return (
		<div className='gap-2'>
			<div className='mt-2 flex'>
				<Label htmlFor='productNumber'>Customer Name</Label>
				<Input
					id='productNumber'
					name='productNumber'
					value={customerDetails.name}
					disabled
				/>
			</div>
			<div className='mt-2 flex'>
				<Label htmlFor='email'>Email</Label>
				<Input id='email' name='email' value={customerDetails.email} disabled />
			</div>
			<div className='mt-2 flex'>
				<Label htmlFor='productCode'>Phone No</Label>
				<Input id='productCode' name='productCode' value={customerDetails.phone} disabled />
			</div>
			{customerDetails.address_line1 && (
				<div className='mt-2 flex'>
					<Label htmlFor='address_line1'>address_line1</Label>
					<Input
						id='address_line1'
						name='address_line1'
						value={customerDetails.address_line1}
						disabled
					/>
				</div>
			)}
			{customerDetails.address_line1 && (
				<div className='mt-2 flex'>
					<Label htmlFor='address_line2'>address_line2</Label>
					<Input
						id='address_line2'
						name='address_line2'
						value={customerDetails.address_line2}
						disabled
					/>
				</div>
			)}
			{customerDetails.file &&
				customerDetails.file.map((file: any) => (
					<div className='mt-2 flex flex-col gap-2' key={file?.fileName}>
						<Label htmlFor={file?.fileName} className='font-medium'>
							{file?.fileName.split('-')[1]}
						</Label>
						<Link to={file?.fileUrl} target='_blank'>
							View
						</Link>
					</div>
				))}
		</div>
	);
};

export default CustomerDetailsCanvas;
