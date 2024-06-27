import { useFormik } from 'formik';
import { post } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import Container from '../../../../components/layouts/Container/Container';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { vendorSchema } from '../../../../utils/formValidations';
import VendorForm from '../../../../components/PageComponets/VendorForm/VendorForm';

const VendorPage = () => {
    const formik: any = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            gstNumber: '',
            company: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipcode: '',
        },
        validationSchema: vendorSchema,
        onSubmit: async (values) => {
            console.log('Values', values);
            try {
                await post('/vendors', values);
                toast.success('Vendor added Successfully!');
            } catch (error: any) {
                toast.error("Error Saving Vendor", error);
            }
            finally {
                navigate(PathRoutes.vendor);
            }
        },
    });


    const navigate = useNavigate();
    return (
        <PageWrapper name='ADD Vendor' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.vendor}`)}
                    >
                        {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
                    </Button>
                    <SubheaderSeparator />
                </SubheaderLeft>
            </Subheader>
            <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
                <Card>
                    <CardBody>
                        <div
                            className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                        >
                            Add Vendor
                        </div>
                        <VendorForm formik={formik} />
                        <div className='flex mt-2 gap-2'>
                            <Button variant='solid' color='blue' type='button' onClick={formik.handleSubmit}>
                                Save Vendor
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper >
    );
};

export default VendorPage;