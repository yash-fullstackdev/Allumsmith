import { Input, Label, Textarea } from "../../../../components/form";

const VendorDetailCanvas = ({vendorDetails}: any) => {
  return (
    <div className='grid grid-cols-1 gap-4 mt-2'>
      <div className='flex items-center'>
        <Label htmlFor='vendorName' className='w-1/3'>
          Vendor Name
        </Label>
        <Input
          id='vendorName'
          name='vendorName'
          value={vendorDetails.name}
          disabled
          className='w-2/3'
        />
      </div>

      <div className='flex items-center'>
        <Label htmlFor='vendorEmail' className='w-1/3'>
          Email
        </Label>
        <Input
          id='vendorEmail'
          name='vendorEmail'
          value={vendorDetails.email}
          disabled
          className='w-2/3'
        />
      </div>

      <div className='flex items-center'>
        <Label htmlFor='vendorPhone' className='w-1/3'>
          Phone Number
        </Label>
        <Input
          id='vendorPhone'
          name='vendorPhone'
          value={vendorDetails.phone}
          disabled
          className='w-2/3'
        />
      </div>

      <div className='flex items-center'>
        <Label htmlFor='vendorGST' className='w-1/3'>
          GST Number
        </Label>
        <Input
          id='vendorGST'
          name='vendorGST'
          value={vendorDetails.gstNumber}
          disabled
          className='w-2/3'
        />
      </div>

      <div className='flex items-center'>
        <Label htmlFor='vendorCompany' className='w-1/3'>
          Company
        </Label>
        <Input
          id='vendorCompany'
          name='vendorCompany'
          value={vendorDetails.company}
          disabled
          className='w-2/3'
        />
      </div>

      <div className='flex items-center'>
        <Label htmlFor='vendorAddress1' className='w-1/3'>
          Address Line 1
        </Label>
        <Textarea
          id='vendorAddress1'
          name='vendorAddress1'
          value={vendorDetails.addressLine1}
          disabled
          className='w-2/3 h-16'
        />
      </div>

      <div className='flex items-center'>
        <Label htmlFor='vendorAddress2' className='w-1/3'>
          Address Line 2
        </Label>
        <Textarea
          id='vendorAddress2'
          name='vendorAddress2'
          value={vendorDetails.addressLine2}
          disabled
          className='w-2/3 h-16'
        />
      </div>

      <div className='flex items-center'>
        <Label htmlFor='vendorCity' className='w-1/3'>
          City
        </Label>
        <Input
          id='vendorCity'
          name='vendorCity'
          value={vendorDetails.city}
          disabled
          className='w-2/3'
        />
      </div>

      <div className='flex items-center'>
        <Label htmlFor='vendorState' className='w-1/3'>
          State
        </Label>
        <Input
          id='vendorState'
          name='vendorState'
          value={vendorDetails.state}
          disabled
          className='w-2/3'
        />
      </div>
    </div>
  )
}

export default VendorDetailCanvas;
