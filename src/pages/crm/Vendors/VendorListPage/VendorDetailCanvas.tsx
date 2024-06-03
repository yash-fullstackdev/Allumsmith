import React from 'react'
import Label from '../../../../components/form/Label'
import Input from '../../../../components/form/Input'
import Textarea from '../../../../components/form/Textarea'

const VendorDetailCanvas = ({vendorDetails}:any) => {
  return (
    <div className='gap-2'>
    <div className='flex mt-2'>
        <Label htmlFor='productNumber'>
            Vendor Name

        </Label>
        <Input
            id='productNumber'
            name='productNumber'
            value={vendorDetails.name}
            disabled
        />
       
    </div>
    
    <div className='flex mt-2'>
        <Label htmlFor='productCode'>
           Email

        </Label>
        <Input
            id='productCode'
            name='productCode'
            value={vendorDetails.email}
            disabled
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='length'>
           Phone Number

        </Label>
        <Input
            id='length'
            name='length'
            value={vendorDetails.phone}
            disabled
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='weight'>
           GST Number

        </Label>
        <Input
            id='weight'
            name='weight'
            value={vendorDetails.gstNumber}
            disabled
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='thickness'>
           Company

        </Label>
        <Input
            id='thickness'
            name='thickness'
            value={vendorDetails.company}
            disabled
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='thickness'>
           Address Line1

        </Label>
        <Textarea
            id='thickness'
            name='thickness'
            value={vendorDetails.addressLine1}
            disabled
            className='h-16'
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='thickness'>
           Address Line2

        </Label>
        <Textarea
            id='thickness'
            name='thickness'
            value={vendorDetails.addressLine2}
            disabled
            className='h-16'
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='thickness'>
           City

        </Label>
        <Input
            id='thickness'
            name='thickness'
            value={vendorDetails.city}
            disabled
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='thickness'>
           State

        </Label>
        <Input
            id='thickness'
            name='thickness'
            value={vendorDetails.state}
            disabled
        />
    </div>
    </div>
  )
}

export default VendorDetailCanvas;
