// import React from 'react'

// const EditColorModal = () => {
//     return (
//         <div>
//             Edit Color
//         </div>
//     )
// }

// export default EditColorModal

import React, { useEffect, useState } from "react";
import { get, put } from "../../../../utils/api-helper.util";
import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/Input";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../../components/layouts/Container/Container";
import Checkbox from "../../../../components/form/Checkbox";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PathRoutes } from "../../../../utils/routes/enum";

const EditColorModal = ({ colorId, setIsEditModal, fetchData }: any) => {
    const [formData, setFormData] = useState<any>({
        name: '',
        code: '',
    });
    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const fetchColorById = async () => {
        try {
            const colorData = await get(`/colors/${colorId}`);
            const { name, code } = colorData.data;
            setFormData({ name, code });
            console.log("Color Data", colorData.data);
        } catch (error) {
            console.error("Error fetching Color Data:", error);
        }
    }

    useEffect(() => {
        fetchColorById();
    }, []);

    const editBranch = async () => {
        console.log("entries", formData);
        try {
            const editedBranch = await put(`/colors/${colorId}`, formData);
            console.log("edited Branch", editedBranch);
            toast.success('Branch edited Successfully!')
        } catch (error: any) {
            console.error("Error updatin Branch", error);
            toast.error('Error updating Branch', error);
        }
        finally {
            setIsEditModal(false);
            fetchData();
        }
    };

    return (
        <PageWrapper name='Edit Branch' isProtectedRoute={true}>
            <Container className='flex shrink-0 grow basis-auto flex-col '>
                <Card>
                    <CardBody>
                        <div className='mt-1 grid grid-cols-12 gap-2'>
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='name'>
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='code'>
                                    Code
                                </Label>
                                <Input
                                    id="code"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                />
                            </div>


                        </div>
                        <div className='flex mt-4 gap-2'>
                            <Button variant='solid' color='blue' type='button' onClick={editBranch}>
                                Update Branch
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper >
    );
};

export default EditColorModal;
