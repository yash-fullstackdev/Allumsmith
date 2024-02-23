import { useNavigate } from "react-router-dom";
import { post } from "../../../../utils/api-helper.util";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";
import Button from "../../../../components/ui/Button";
import { PathRoutes } from "../../../../utils/routes/enum";
import Container from "../../../../components/layouts/Container/Container";
import AddPurchaseOrderForm from "./AddPurchaseOrderForm";


const AddPurchaseOrderPage = () => {
    const navigation = useNavigate();

    const handleFiles = async (event: any) => {
        try {
            const files = event.target.files;
            const formData = new FormData();
            formData.append("csvFile", files[0]);

            const { data } = await post("/products/uploadcsv", formData);
            console.log("data", data);

            // Handle success or additional logic if needed

        } catch (error) {
            console.error("Error uploading CSV file:", error);
            // Handle error
        }
    };

    return (
        <PageWrapper name='ADD PRODUCTS' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigation(`${PathRoutes.purchase_order}`)}
                    >
                        {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
                    </Button>
                    <SubheaderSeparator />
                </SubheaderLeft>
                {/* <SubheaderRight>
                    <div className='col-span-1'>
                        <input
                            type={"file"}
                            id={"csvFileInput"}
                            accept=".csv"
                            onChange={handleFiles}

                        />
                    </div>
                    <Button variant='solid' onClick={handleFiles}>Add File</Button>
                </SubheaderRight> */}
            </Subheader>
            <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
                <div className='flex h-full flex-wrap content-start'>
                    <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
                        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                            <AddPurchaseOrderForm />
                        </div>
                    </div>
                </div>
            </Container>
        </PageWrapper>
    );
};

export default AddPurchaseOrderPage;
