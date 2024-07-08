import { useNavigate } from "react-router-dom";
import Button from "../../../../components/ui/Button";
import { PathRoutes } from "../../../../utils/routes/enum";
import AddCustomerOrderForm from "./AddCustomerOrderForm";
import { Container, PageWrapper, Subheader, SubheaderLeft, SubheaderSeparator } from "../../../../components/layouts";


const AddCustomerOrderPage = () => {
    const navigation = useNavigate();

    return (
        <PageWrapper name='ADD PRODUCTS' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigation(`${PathRoutes.customer_order}`)}
                    >
                        {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
                    </Button>
                    <SubheaderSeparator />
                </SubheaderLeft>

            </Subheader>
            <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
                <AddCustomerOrderForm />
            </Container>
        </PageWrapper>
    );
};

export default AddCustomerOrderPage;
