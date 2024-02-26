import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../../../utils/api-helper.util";
import { PathRoutes } from "../../../../utils/routes/enum";
import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/Input";
import Checkbox from "../../../../components/form/Checkbox";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";
import Container from "../../../../components/layouts/Container/Container";


const BranchesPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zipcode: '',
        type: '',
        phone: '',
        contact_name: '',
        contact_phone: '',
        isArchive: false
    });

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const navigate = useNavigate();




    const addBranchesToDatabase = async () => {

        console.log("entries", formData)
        try {
            const branches = await post('/branches', formData);
            console.log("Branches", branches)
        } catch (error: any) {
            console.error("Error Saving Vendor", error)
        }
        finally {
            navigate(PathRoutes.branches);
        }

    };



    return (
        <PageWrapper name='ADD Branches' isProtectedRoute={true}>
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
            <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
                <div className='flex h-full flex-wrap content-start'>
                    <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
                        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                            <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                                <Card>
                                    <CardBody>
                                        <div className='flex'>
                                            <div className='bold w-full'>
                                                <Button
                                                    variant='outlined'
                                                    className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'

                                                >
                                                    Add Branches
                                                </Button>
                                            </div>
                                        </div>

                                        <div className='mt-5 grid grid-cols-12 gap-2'>
                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='name'>
                                                    Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for name field */}
                                            </div>
                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='address_line1'>
                                                    Address 1
                                                </Label>
                                                <Input
                                                    id="address_line1"
                                                    name="address_line1"
                                                    value={formData.address_line1}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for addressline1 field */}
                                            </div>
                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='address_line2'>Address Line 2</Label>
                                                <Input
                                                    id="address_line2"
                                                    name="address_line2"
                                                    value={formData.address_line2}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for addressLine2 field */}
                                            </div>
                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='city'>
                                                    City
                                                </Label>
                                                <Input
                                                    id="city"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for city field */}
                                            </div>
                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='state'>
                                                    State
                                                </Label>
                                                <Input
                                                    id="state"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for state field */}
                                            </div>
                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='zipcode'>
                                                    Zipcode
                                                </Label>
                                                <Input
                                                    id="zipcode"
                                                    name="zipcode"
                                                    value={formData.zipcode}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for zipcode field */}
                                            </div>
                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='type'>
                                                    Type
                                                </Label>
                                                <Input
                                                    id="type"
                                                    name="type"
                                                    value={formData.type}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for GST Number field */}
                                            </div>
                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='phone'>
                                                    Phone
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for phone field */}
                                            </div>

                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='contact_name'>
                                                    Contact Name
                                                </Label>
                                                <Input
                                                    id="contact_name"
                                                    name="contact_name"
                                                    value={formData.contact_name}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for company field */}
                                            </div>

                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='contact_phone'>
                                                    Contact Phone
                                                </Label>
                                                <Input
                                                    id="contact_phone"
                                                    name="contact_phone"
                                                    value={formData.contact_phone}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for company field */}
                                            </div>

                                            <div className='col-span-12 lg:col-span-2'>
                                                <Label htmlFor='isArchive'>Is Archive</Label>
                                                <Checkbox
                                                    id="isArchive"
                                                    name="isArchive"

                                                    checked={formData.isArchive}
                                                    onChange={handleChange}
                                                />
                                                {/* ... Error handling for isArchive field */}
                                            </div>
                                        </div>


                                        <div className='flex mt-4 gap-2'>

                                            <Button variant='solid' color='blue' type='button' onClick={addBranchesToDatabase}>
                                                Save Branch
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </PageWrapper >
    );
};

export default BranchesPage;