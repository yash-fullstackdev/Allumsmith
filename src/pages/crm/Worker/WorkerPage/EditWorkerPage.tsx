import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, put } from "../../../../utils/api-helper.util";
import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/Input";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../../components/layouts/Container/Container";
import Checkbox from "../../../../components/form/Checkbox";
import { toast } from "react-toastify";
import { PathRoutes } from "../../../../utils/routes/enum";
import Subheader, { SubheaderLeft, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";

const EditWorkerPage = () => {
    const [formData, setFormData] = useState<any>({
        name: '',
        email: '',
        phone: '',
        company: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zipcode: '',
        pancard: ''
    });
    const navigate = useNavigate();

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const { id } = useParams();
    const fetchWorkerById = async () => {
        try {
            const worker = await get(`/workers/${id}`);
            const { name, email, phone, company, address_line1, address_line2, city, state, zipcode, pancard} = worker.data;
            setFormData({ name, email, phone, company, address_line1, address_line2, city, state, zipcode, pancard});
        } catch (error) {
            console.error("Error fetching Worker data:", error);
        }
    }

    useEffect(() => {
        fetchWorkerById();
    }, []);

    const editWorker = async () => {
        console.log("entries", formData);
        try {
            const editedWorker = await put(`/workers/${id}`, formData);
            console.log("edited worker", editedWorker)
            toast.success("Worker edited Successfully!")
        } catch (error: any) {
            console.error("Error Updating Worker", error);
            toast.error('Error Updating Worker', error)
        }
        finally {
            navigate(PathRoutes.worker);

        }
    };

    return (
        <PageWrapper name='Edit Worker' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.worker}`)}
                    >
                        {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
                    </Button>
                    <SubheaderSeparator />
                </SubheaderLeft>

            </Subheader>
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
                                <Label htmlFor='email'>
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='phone'>
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='company'>
                                    Company
                                </Label>
                                <Input
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='address_line1'>
                                    Address Line 1
                                </Label>
                                <Input
                                    id="address_line1"
                                    name="address_line1"
                                    value={formData.address_line1}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='address_line2'>Address Line 2</Label>
                                <Input
                                    id="address_line2"
                                    name="address_line2"
                                    value={formData.address_line2}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='city'>
                                    City
                                </Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='state'>
                                    State
                                </Label>
                                <Input
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='zipcode'>
                                    Zipcode
                                </Label>
                                <Input
                                    id="zipcode"
                                    name="zipcode"
                                    value={formData.zipcode}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='pancard'>
                                    Pan Card
                                </Label>
                                <Input
                                    id="pancard"
                                    name="pancard"
                                    value={formData.pancard}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>

                        <div className='flex mt-4 gap-2'>
                            <Button variant='solid' color='blue' type='button' onClick={editWorker}>
                                Update Worker
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper >
    );
};

export default EditWorkerPage;
