import React, { useEffect, useState } from 'react';
import { get, put } from '../../../../utils/api-helper.util';
import Label from '../../../../components/form/Label';
import Card from '../../../../components/ui/Card';
import Select from '../../../../components/form/Select';
import Button from '../../../../components/ui/Button';
import { toast } from 'react-toastify';
import Input from '../../../../components/form/Input';
import SelectReact from '../../../../components/form/SelectReact';

const StatusModal = ({ status, setStatus,jobId, setStatusModal, fetchData}: any) => {
    const [workerData, setWorkerData] = useState<any>([]);
    const [worker, setWorker] = useState<any>();
    const [powderInKgs, setPowderInKgs] = useState<number | string>('');
    const [powderData, setPowderData] = useState<any>([]);
    const [entries, setEntries] = useState<any>([{ powder: '', powderInKgs: '' }]);
    const [powder, setPowder] = useState<any>();

    const handleDeleteProduct = (index: any) => {
        const newEntries = [...entries];
        newEntries.splice(index, 1);
        setEntries(newEntries);
    };

    const handleAddEntry = () => {
        setEntries([...entries, { powder: '', powderInKgs: '' }]);
    };

    const updateStatus = async () => {
        try {
            let payload: any = { status };

            if (status === 'completed') {
                if (!worker) {
                    throw new Error('Worker, Powder, and Powder in kgs are required for completed status');
                }
                const powdersPayload = entries.map((entry: any) => ({
                    powder: entry.powder,
                    powderInKgs: parseFloat(entry.powderInKgs)
                }));
    
                payload = { ...payload, worker, powder: powdersPayload };
            }

            console.log('Payload', payload);
            const { data } = await put(`/jobs/${jobId}/updateJobStatus`, payload);
            toast.success('Status Updated Successfully');
            setStatusModal(false);
            fetchData();
        } catch (error) {
            console.error('Error Updating Status', error);
            toast.error('Failed to update status');
        } finally {
            // setStatusModal(false);
            // fetchData();
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
                        {entries.map((entry: any, index: number) => (
                            <div key={index} className='flex gap-2'>
                                <div className='col-span-6 lg:col-span-3'>
                                    <Label htmlFor={`powder-${index}`}>Powder</Label>
                                    <Select
                                        id={`powder-${index}`}
                                        placeholder='Select Powder'
                                        name={`powder-${index}`}
                                        value={entry.powder}
                                        onChange={(e) => {
                                            const newEntries = [...entries];
                                            newEntries[index].powder = e.target.value;
                                            setEntries(newEntries);
                                        }}
                                    >
                                        {powderData.map((powder: any, index: number) => (
                                            <option key={index} value={powder._id}>{powder.name}</option>
                                        ))}
                                    </Select>
                                </div>
                                <div className='col-span-6 lg:col-span-3'>
                                    <Label htmlFor={`powderInKgs-${index}`}>Powder (in kgs)</Label>
                                    <Input
                                        type='number'
                                        id={`powderInKgs-${index}`}
                                        name={`powderInKgs-${index}`}
                                        value={entry.powderInKgs}
                                        onChange={(e) => {
                                            const newEntries = [...entries];
                                            newEntries[index].powderInKgs = e.target.value;
                                            setEntries(newEntries);
                                        }}
                                        placeholder='Enter powder in kgs'
                                    />
                                </div>
                                {entries.length > 1 && (
                                    <div className='flex items-center'>
                                        <Button type='button' onClick={() => handleDeleteProduct(index)} icon='HeroXMark'/>
                                            
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className='flex justify-between mt-3'>
                            <Button variant='outline'  type='button' onClick={handleAddEntry}>
                                Add Entry
                            </Button>
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

export default StatusModal;
