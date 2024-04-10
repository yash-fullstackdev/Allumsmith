import React, { useEffect, useState } from 'react';
import { get, put } from '../../../../../utils/api-helper.util';
import Label from '../../../../../components/form/Label';
import Card from '../../../../../components/ui/Card';
import Select from '../../../../../components/form/Select';
import Button from '../../../../../components/ui/Button';
import { toast } from 'react-toastify';
import Input from '../../../../../components/form/Input';

const WithoutMaterialStatus = ({ status, setStatus, jobId, setStatusModal, fetchData }: any) => {

    const updateStatus = async () => {
        try {
            let payload: any = { status };

                payload = { ...payload, };
            console.log('Payload', payload);
            const { data } = await put(`/jobs/${jobId}/updateJobStatus`, payload);
            toast.success('Status Updated Successfully');
        } catch (error) {
            console.error('Error Updating Status', error);
            toast.error('Failed to update status');
        } finally {
            setStatusModal(false);
            fetchData();
        }
    };
    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
    };

    const handleSubmit = () => {
        updateStatus();
    };

    return (
        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
            <Card>
                <div className='col-span-6 lg:col-span-3'>
                    <Label htmlFor='status'>Status</Label>
                    <Select
                        id='status'
                        placeholder='Select Status'
                        name='status'
                        value={status}
                        onChange={handleStatusChange}
                    >
                        <option value='' disabled>Select Status</option>
                        <option value='in_progress'>In Progress</option>
                        <option value='pending'>Pending</option>
                        <option value='completed'>Completed</option>
                    </Select>
                </div>
                <div className='mt-3'>
                    <Button variant='solid' color='blue' type='button' onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default WithoutMaterialStatus;
