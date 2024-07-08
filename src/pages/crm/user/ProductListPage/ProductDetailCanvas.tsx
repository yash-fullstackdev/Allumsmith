import { Input, Label } from "../../../../components/form";


const ProductDetailCanvas = ({ productDetails }: any) => {
	return (
		<div className='gap-4 grid mt-2'>
			<div className='flex items-center'>
				<Label htmlFor='productName' className='w-1/3'>
					Product Name
				</Label>
				<Input
					id='productName'
					name='productName'
					value={productDetails.name}
					disabled
					className='w-2/3'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='hsn' className='w-1/3'>
					HSN
				</Label>
				<Input
					id='hsn'
					name='hsn'
					value={productDetails.hsn}
					disabled
					className='w-2/3'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='productCode' className='w-1/3'>
					Product Code
				</Label>
				<Input
					id='productCode'
					name='productCode'
					value={productDetails.productCode}
					disabled
					className='w-2/3'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='length' className='w-1/3'>
					Length
				</Label>
				<Input
					id='length'
					name='length'
					value={productDetails.length}
					disabled
					className='w-2/3'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='weight' className='w-1/3'>
					Weight
				</Label>
				<Input
					id='weight'
					name='weight'
					value={productDetails.weight}
					disabled
					className='w-2/3'
				/>
			</div>
			<div className='flex items-center'>
				<Label htmlFor='thickness' className='w-1/3'>
					Thickness
				</Label>
				<Input
					id='thickness'
					name='thickness'
					value={productDetails.thickness}
					disabled
					className='w-2/3'
				/>
			</div>
		</div>
	)
}

export default ProductDetailCanvas;
