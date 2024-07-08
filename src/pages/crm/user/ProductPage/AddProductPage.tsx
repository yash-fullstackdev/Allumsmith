
import Button from '../../../../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { PathRoutes } from '../../../../utils/routes/enum'
import AddproductForm from './AddProductForm'
import { Container, PageWrapper, Subheader, SubheaderLeft, SubheaderSeparator } from '../../../../components/layouts'

const AddProductPage = () => {
	const navigation = useNavigate();
	return (
		<PageWrapper name='ADD PRODUCTS' isProtectedRoute={true}>
			<Subheader>
				<SubheaderLeft>
					<Button
						icon='HeroArrowLeft'
						className='!px-0'
						onClick={() => navigation(`${PathRoutes.product}`)}
					>
						{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
					</Button>
					<SubheaderSeparator />
				</SubheaderLeft>

			</Subheader>
			<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
				<AddproductForm />
			</Container>
		</PageWrapper>
	)
}

export default AddProductPage