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

const EditCustomerPage = () => {
    const [formData, setFormData] = useState<any>({
        name: '',
        email: '',
        phone: '',
        gst_number: '',
        company: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zipcode: '',
        premiumDiscount: "",
        commercial_discount:'',
        wooden_discount:''
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
    const fetchCustomerById = async () => {
        try {
            const customer = await get(`/customers/${id}`);
            const { name, email, phone, gst_number, company, address_line1, address_line2, city, state, zipcode, default_discount } = customer.data;
            setFormData({ name, email, phone, gst_number, company, address_line1, address_line2, city, state, zipcode, default_discount });
        } catch (error) {
            console.error("Error fetching Customer data:", error);
        }
    }

    useEffect(() => {
        fetchCustomerById();
    }, []);

    const editCustomer = async () => {
        console.log("entries", formData);
        try {
            const editedCustomer = await put(`/customers/${id}`, formData);
            console.log("edited customer", editedCustomer)
            toast.success("Cusomer edited Successfully!")
        } catch (error: any) {
            console.error("Error Updating Customer", error);
            toast.error('Error Updating Customer', error)
        }
        finally {
            navigate(PathRoutes.customer);
        }
    };

    return (
        <PageWrapper name='Edit Customer' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.customer}`)}
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
                                <Label htmlFor='gst_number'>
                                    GST Number
                                </Label>
                                <Input
                                    id="gst_number"
                                    name="gst_number"
                                    value={formData.gst_number}
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
                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='premium_discount'>
                                                   Premium Discount
                                                </Label>
                                                <Input
                                                    id="premium_discount"
                                                    name="premium_discount"
                                                    value={formData.premiumDiscount}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for zipcode field */}
                                            </div>
                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='commercial_discount'>
                                                   Commercial Discount
                                                </Label>
                                                <Input
                                                    id="commercial_discount"
                                                    name="commercial_discount"
                                                    value={formData.commercial_discount}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for zipcode field */}
                                            </div>
                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='wooden_discount'>
                                                   Wooden Discount
                                                </Label>
                                                <Input
                                                    id="wooden_discount"
                                                    name="wooden_discount"
                                                    value={formData.wooden_discount}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for zipcode field */}
                                            </div>

                        </div>

                        <div className='flex mt-4 gap-2'>
                            <Button variant='solid' color='blue' type='button' onClick={editCustomer}>
                                Update Customer
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper >
    );
};

export default EditCustomerPage;
