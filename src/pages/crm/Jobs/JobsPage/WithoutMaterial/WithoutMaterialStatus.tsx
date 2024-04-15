import React, { useEffect, useState } from 'react';
import { get, put } from '../../../../../utils/api-helper.util';
import Label from '../../../../../components/form/Label';
import Card from '../../../../../components/ui/Card';
import Select from '../../../../../components/form/Select';
import Button from '../../../../../components/ui/Button';
import { toast } from 'react-toastify';
import Input from '../../../../../components/form/Input';

const WithoutMaterialStatus = ({ status, setStatus, jobId, setStatusModal, fetchDatajobwm }: any) => {

    const [workerData, setWorkerData] = useState<any>([]);
    const [worker, setWorker] = useState<any>();
    const [powderInKgs, setPowderInKgs] = useState<number | string>('');
    const [powderData, setPowderData] = useState<any>([]);
    const [powder, setPowder] = useState<any>();

    const updateStatus = async () => {
        try {
            let payload: any = { status };

            if (status === 'completed') {
                if (!worker) {
                    throw new Error('Worker is required for completed status');
                }
                if (!powderInKgs) {
                    throw new Error('Powder in kgs is required for completed status');
                }
                if (!powder) {
                    throw new Error('Powder is required for completed status');
                }
                payload = { ...payload, worker, powder, powderQuantity: Number(powderInKgs) };
            }

            console.log('Payload', payload);
            const { data } = await put(`/jobwm/${jobId}`, payload);
            toast.success('Status Updated Successfully');
        } catch (error) {
            console.error('Error Updating Status', error);
            toast.error('Failed to update status');
        } finally {
            setStatusModal(false);
            fetchDatajobwm();
        }
    };


    const getWorkers = async () => {
        try {
            const { data } = await get('/workers');
            setWorkerData(data);
        } catch (error) {
            console.error('Error fetching workers', error);
            toast.error('Failed to fetch workers');
        }
    };

    const getPowderData = async () => {
        try {
            const { data } = await get('/utilities');
            console.log('Powder Data', powderData);

            setPowderData(data);
        } catch (error) {
            console.error('Error Fetching Powder', error);
            toast.error('Failed to fetch Powders');
        }
    };

    useEffect(() => {
        getWorkers();
        getPowderData();
    }, []);

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
    };

    const handleWorkerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newWorker = event.target.value;
        setWorker(newWorker);
    };

    const handlePowderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPowder = event.target.value;
        setPowder(newPowder);
    };

    const handlePowderInKgsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const powder = event.target.value;
        setPowderInKgs(powder);
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
                {status === 'completed' && (
                    <>
                        <div className='col-span-6 lg:col-span-3'>
                            <Label htmlFor='worker'>Worker</Label>
                            <Select
                                id='worker'
                                placeholder='Select Worker'
                                name='worker'
                                value={worker}
                                onChange={handleWorkerChange}
                            >
                                {workerData.map((worker: any, index: number) => (
                                    <option key={index} value={worker._id}>{worker.name}</option>
                                ))}
                            </Select>
                        </div>
                        <div className='col-span-6 lg:col-span-3'>
                            <Label htmlFor='powder'>Powder</Label>
                            <Select
                                id='powder'
                                placeholder='Select Powder'
                                name='powder'
                                value={powder}
                                onChange={handlePowderChange}
                            >
                                {powderData.map((powder: any, index: number) => (
                                    <option key={index} value={powder._id}>{powder.name}</option>
                                ))}
                            </Select>
                        </div>
                        <div className='col-span-6 lg:col-span-3'>
                            <Label htmlFor='powderInKgs'>Powder (in kgs)</Label>
                            <Input
                                type='number'
                                id='powderInKgs'
                                name='powderInKgs'
                                value={powderInKgs}
                                onChange={handlePowderInKgsChange}
                                placeholder='Enter powder in kgs'
                            />
                        </div>
                    </>
                )}
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
