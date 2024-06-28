import { useNavigate } from "react-router-dom";
import { post } from "../../../../utils/api-helper.util";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";
import Button from "../../../../components/ui/Button";
import { PathRoutes } from "../../../../utils/routes/enum";
import Container from "../../../../components/layouts/Container/Container";
import AddCustomerOrderForm from "./AddCustomerOrderForm";


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
