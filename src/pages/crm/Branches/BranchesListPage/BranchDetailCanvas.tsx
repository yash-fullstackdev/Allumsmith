import React from 'react'
import Label from '../../../../components/form/Label'
import Input from '../../../../components/form/Input'
import Textarea from '../../../../components/form/Textarea'

const BranchDetailCanvas = ({branchDetails}:any) => {
  return (
    <div className='gap-2'>
    <div className='flex mt-2'>
        <Label htmlFor='productNumber'>
            Branch Name

        </Label>
        <Input
            id='productNumber'
            name='productNumber'
            value={branchDetails.name}
            disabled
        />
       
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='thickness'>
           Phone

        </Label>
        <Input
            id='thickness'
            name='thickness'
            value={branchDetails.phone}
            disabled
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='thickness'>
           Contact Person Name

        </Label>
        <Input
            id='thickness'
            name='thickness'
            value={branchDetails.contact_name}
            disabled
        />
    </div>
    <div className='flex mt-2'>
        <Label htmlFor='thickness'>
           Contact Person Phone

        </Label>
        <Input
            id='thickness'
            name='thickness'
            value={branchDetails.contact_phone}
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
            value={branchDetails.address_line1}
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
            value={branchDetails.address_line2}
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
            value={branchDetails.city}
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
            value={branchDetails.state}
            disabled
        />
    </div>
    
    </div>
  )
}

export default BranchDetailCanvas;
