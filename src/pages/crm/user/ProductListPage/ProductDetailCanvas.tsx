import React from 'react'
import Label from '../../../../components/form/Label'
import Input from '../../../../components/form/Input'

const ProductDetailCanvas = ({productDetails}:any) => {
  return (
    <div className='gap-2'>
    <div className='flex mt-2'>
        <Label htmlFor='productNumber'>
            Product Name

        </Label>
        <Input
            id='productNumber'
            name='productNumber'
            value={productDetails.name}
            disabled
        />
       
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='hsn'>
          HSN

        </Label>
        <Input
            id='hsn'
            name='hsn'
            value={productDetails.hsn}
            disabled
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='productCode'>
           Product Code

        </Label>
        <Input
            id='productCode'
            name='productCode'
            value={productDetails.productCode}
            disabled
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='length'>
           Length

        </Label>
        <Input
            id='length'
            name='length'
            value={productDetails.length}
            disabled
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='weight'>
           Weight

        </Label>
        <Input
            id='weight'
            name='weight'
            value={productDetails.weight}
            disabled
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='thickness'>
           Thickness

        </Label>
        <Input
            id='thickness'
            name='thickness'
            value={productDetails.thickness}
            disabled
        />
    </div>
    </div>
  )
}

export default ProductDetailCanvas
