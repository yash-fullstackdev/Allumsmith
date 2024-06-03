
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
import { useNavigate, useParams } from "react-router-dom";
import { PathRoutes } from "../../../../utils/routes/enum";
import Subheader, { SubheaderLeft, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";

const EditBranchPage = () => {
    const [formData, setFormData] = useState<any>({
        name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zipcode: '',
        phone: '',
        contact_name: '',
        contact_phone: '',
    });
    const { id } = useParams();
    const navigate = useNavigate();
    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const fetchBranchById = async () => {
        try {
            const branchData = await get(`/branches/${id}`);
            const { name, address_line1, address_line2, city, state, zipcode, phone, contact_name, contact_phone } = branchData.data;
            setFormData({ name, address_line1, address_line2, city, state, zipcode, phone, contact_name, contact_phone });
            console.log("Branch Data", branchData.data);
        } catch (error) {
            console.error("Error fetching branch data:", error);
        }
    }

    useEffect(() => {
        fetchBranchById();
    }, []);

    const editBranch = async () => {
        console.log("entries", formData);
        try {
            const editedBranch = await put(`/branches/${id}`, formData);
            console.log("edited Branch", editedBranch);
            toast.success('Branch edited Successfully!')
        } catch (error: any) {
            console.error("Error updatin Branch", error);
            toast.error('Error updating Branch', error);
        }
        finally {
            navigate(PathRoutes.branches)
        }
    };

    return (
        <PageWrapper name='Edit Branch' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.branches}`)}
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
                                <Label htmlFor='contact_name'>
                                    Contact Name
                                </Label>
                                <Input
                                    id="contact_name"
                                    name="contact_name"
                                    value={formData.contact_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='contact_phone'>
                                    Contact Phone
                                </Label>
                                <Input
                                    id="contact_phone"
                                    name="contact_phone"
                                    value={formData.contact_phone}
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

export default EditBranchPage;
