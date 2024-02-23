import { useState } from "react"
import Card, { CardBody } from "../../../../components/ui/Card"
import Button from "../../../../components/ui/Button"
import Collapse from "../../../../components/utils/Collapse"
import Label from "../../../../components/form/Label"
import Input from "../../../../components/form/Input"
import Select from "../../../../components/form/Select"
import getUserRights from "../../../../hooks/useUserRights"
import { handleInputChange } from "../../../../utils/capitalizedFunction.util"

const CustomerInfo = ({ formik, accordionStates, setAccordionStates }: any) => {


    const privileges = getUserRights('vendors');
    return (
        <Card>
            <CardBody>
                <div className="flex">
                    <div className="bold w-full">
                        <Button
                            variant="outlined"
                            className="flex w-full items-center justify-between rounded-none border-b text-lg font-bold text-start px-[2px] py-[0px]"
                            onClick={() => setAccordionStates({ ...accordionStates, custInfo: !accordionStates.custInfo })}
                            rightIcon={!accordionStates.custInfo ? 'HeroChevronUp' : 'HeroChevronDown'}>
                            Vendor Information
                        </Button>
                    </div>
                </div>
                <Collapse isOpen={!accordionStates.custInfo}>
                    <div className='mt-4 grid grid-cols-12 gap-4'>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor="customerInVendor">Customer # in Vendor System</Label>
                            <Input
                                id="customerInVendor"
                                name="customerInVendor"
                                onChange={handleInputChange(formik.setFieldValue)('customerInVendor')}
                                value={formik.values.customerInVendor}
                                onBlur={formik.handleBlur}
                                disabled={!privileges.canWrite()}
                            />
                            {formik.touched.customerInVendor && formik.errors.customerInVendor ? (
                                <div className='text-red-500'>{formik.errors.customerInVendor}</div>
                            ) : null}
                        </div>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='custPORequired'>
                                Cust PO Required
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Select
                                id='custPORequired'
                                name='custPORequired'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.custPORequired || 'YES'}
                                disabled={!privileges.canWrite()}

                            >
                                <option value='YES'>YES</option>
                                <option value='NO'>NO</option>
                            </Select>
                            {formik.touched.custPORequired && formik.errors.custPORequired ? (
                                <div className='text-red-500'>
                                    {formik.errors.custPORequired}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </Collapse>
            </CardBody>
        </Card>
    )
}

export default CustomerInfo
