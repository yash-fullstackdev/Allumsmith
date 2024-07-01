import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../../utils/api-helper.util";
import { toast } from "react-toastify";
import { PathRoutes } from "../../../utils/routes/enum";
import Card, { CardBody } from "../../../components/ui/Card";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/Input";
import Button from "../../../components/ui/Button";
import Select from "../../../components/form/Select";

const AddPowderModal = ({ setPowderQuantityModal, getPowderList }: any) => {
    const navigate = useNavigate();
    const [branchData, setBranchData] = useState<any>([]);
    const [powderData, setPowderData] = useState<any>([]);
    const [selectedPowder, setSelectedPowder] = useState<any>(null);
    const [branchId, setBranchId] = useState('');
    const [quantity, setQuantity] = useState('');

    const getBranchDetails = async () => {
        try {
            const { data } = await get('/branches');
            setBranchData(data);
        } catch (error) {
            console.error("Error Fetching Branch", error);
        }
    }

    const getPowderDetails = async () => {
        try {
            const { data } = await get('/utilities');
            setPowderData(data);
        } catch (error) {
            console.error('Error Fetching Powder', error)
        }
    }

    useEffect(() => {
        getBranchDetails();
        getPowderDetails();
    }, []);

    const handleSaveItems = async () => {
        const formData = {
            utility: selectedPowder._id,
            powderName: selectedPowder.name,
            powderCode: selectedPowder.code,
            branch: branchId,
            quantity,
        }
        console.log('Form Data', formData);

        try {
            const powder = await post('/utility_inventory/stockaction', formData);
            toast.success('Powder added Successfully!')
            setPowderQuantityModal(false);
            getPowderList();
        } catch (error: any) {
            console.error("Error Saving Powder", error)
            toast.error(error.response.data.message, error)
        }
        
    }

    return (
        <Card>
            <CardBody>
                <div>
                    <div className='mt-2 grid grid-cols-12 gap-1'>
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='name'>
                                Powder
                                <span className='ml-1 text-red-500'>*</span>
                            </Label>
                            <Select
                                id={`name`}
                                name={`name`}
                                value={selectedPowder ? selectedPowder.name : ''}
                                onChange={(e) => {
                                    const powder = powderData.find((item: any) => item.name === e.target.value);
                                    setSelectedPowder(powder);
                                }}
                            >
                                <option value="">Select Powder</option>
                                {powderData.map((powder: any) => (
                                    <option key={powder._id} value={powder.name}>
                                        {powder.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        {selectedPowder && (
                            <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='code'>
                                    Code
                                    <span className='ml-1 text-red-500'>*</span>
                                </Label>
                                <Input
                                    type='number'
                                    id={`code`}
                                    name={`code`}
                                    value={selectedPowder.code}
                                    readOnly
                                />
                            </div>
                        )}
                        <div className='col-span-12 lg:col-span-6'>
                            <Label htmlFor='quantity'>
                                Quantity(kg)
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
                    </div>
                </div>
                <div className='col-span-12 lg:col-span-12'>
                    <div className='flex mt-2 gap-2 '>
                        <Button variant='solid' color='blue' type='button' onClick={handleSaveItems}>
                            Save Entries
                        </Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default AddPowderModal;
