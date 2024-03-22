import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, post, put } from "../../../../utils/api-helper.util";
import { PathRoutes } from "../../../../utils/routes/enum";
import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/Input";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../../components/layouts/Container/Container";
import CreatableSelect from 'react-select/creatable';
import { toast } from "react-toastify";
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";


const EditColorPage = () => {
    const navigate = useNavigate();
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
 const {id} = useParams();
    console.log("🚀 ~ EditColorPage ~ id:", id)
    const fetchColorById = async () => {
        try {
            const colorData = await get(`/colors/${id}`);
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

    const editColor = async () => {
        try {
            const editedBranch = await put(`/colors/${id}`, formData);
            console.log("edited Branch", editedBranch);
            toast.success('Color edited Successfully!')

        } catch (error: any) {
            toast.error('Error updating Color', error);
        }
        finally {
            navigate(PathRoutes.colors)
        }
    };
return(<>
<PageWrapper name='Edit Color' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.colors}`)}
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
                            <Button variant='solid' color='blue' type='button' onClick={editColor}>
                                Update Color
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
</PageWrapper >
</>)
}
export default EditColorPage;