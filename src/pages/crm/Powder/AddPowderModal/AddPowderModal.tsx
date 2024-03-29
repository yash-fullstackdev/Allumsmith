/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState } from 'react';
import { get, post } from '../../../../utils/api-helper.util';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { PathRoutes } from '../../../../utils/routes/enum';

const AddPowderModal = ({ SetAddPowderModal }: any) => {

    const navigate = useNavigate();
    
    const [branchData, setBranchData] = useState<any>([]);
    const [name, setName] = useState('');
    const [branchId, setBranchId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [code, setCode] = useState('');


    const getBranchDetails = async () => {
        try {
            const { data } = await get('/branches');
            setBranchData(data);
        } catch (error) {
            console.error("Error Fetching Branch", error);
        }
    }

    useEffect(() => {
        getBranchDetails();
    }, []);


    const handleSaveItems = async () => {
        const formData = {
            name,
            branchId,
            quantity,
            code,
        }
        console.log("Form Data:", formData);
        
        try {
            const powder = await post('/utilities', formData);
            console.log("Powder", powder);
            toast.success('Powder added Successfully!')
            SetAddPowderModal(false);
        } catch (error: any) {
            console.error("Error Saving Powder", error)
            toast.error('Error Saving Powder', error)
        }
        finally {
            navigate(PathRoutes.powder);
        }
    }

    return (
        <Card>
            <CardBody>
                <div>
                    <div className='mt-2 grid grid-cols-12 gap-1'>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='name'>
                                Name
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Input
                                type='text'
                                id={`name`}
                                name={`name`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}               
                            />
                        </div>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='code'>
                                Code
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Input
                                type='number'
                                id={`number`}
                                name={`number`}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='quantity'>
                                Quantity
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Input
                                type='number'
                                id={`number`}
                                name={`number`}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}              
                            />
                        </div>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='branch'>
                                Branch
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Select
                                id={`branch`}
                                name={`branch`}
                                value={branchId}
                                onChange={(e) => setBranchId(e.target.value)}
                            >
                                <option value="">Select Branch</option>
                                {branchData.map((branch: any) => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div className='col-span-12 lg:col-span-12'>
                            <div className='flex mt-2 gap-2 '>
                                <Button variant='solid' color='blue' type='button' onClick={handleSaveItems}>
                                    Save Entries
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default AddPowderModal;