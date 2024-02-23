[![Netlify Status](https://api.netlify.com/api/v1/badges/42118bfb-c41b-4015-9ae8-cf2c725a6dd2/deploy-status)](https://app.netlify.com/sites/fyr-react/deploys)

# Fyr | React TypeScript Tailwind Admin & AI Chat Template

[![Fyr | React TypeScript Tailwind Admin & AI Chat Template](./src/assets/Cover.png)](https://fyr.omtanke.studio)

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and [TailwindCSS](https://github.com/tailwindlabs/tailwindcss).

## Install Dependencies

### `npm install` or `yarn install`

## Available Scripts

In the project directory, you can run:

### `npm start` or `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `npm run lint` or `yarn run lint`

Controls the project according to Eslint rules.

### `npm run lint:fix` or `yarn run lint:fix`

Inspects the project according to Eslint rules and corrects them according to those rules.

### `npm run prettier:fix` or `yarn run prettier:fix`

Inspects the project according to Prettier rules and corrects them according to those rules.

### `npm run icon` or `yarn run icon`

Prepares svg format icons in the `SvgIcons` folder for use in the project. Names the icon's name in `PascalCase` format.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Project Structure

```
fyr
├── public
├── src
│   ├── App
│   ├── assets
│   ├── components
│   ├── config
│   │   ├── pages.config.ts
│   │   └── theme.config.ts
│   ├── constants
│   ├── context
│   ├── hooks
│   ├── interface
│   ├── locales
│   ├── mocks
│   ├── pages
│   ├── routes
│   │   ├── asideRoutes.tsx
│   │   ├── contentRoutes.tsx
│   │   ├── footerRoutes.tsx
│   │   └── headerRoutes.tsx
│   ├── styles
│   ├── templates
│   ├── types
│   ├── utils
│   ├── declaration.d.ts
│   ├── i18n.ts
│   ├── index.tsx
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   └── setupTests.ts
├── SvgIcons
├── .eslintignore
├── .eslintrc.json
├── .gitattributes
├── .gitignore
├── .npmrc
├── .prettierignore
├── .svgrc
├── package.json
├── postcss.config.js
├── prettier.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.eslint.json
└── tsconfig.json
```

# Tailwind Configure

There are 22 colors defined in Tailwind, we have added 8 (zinc `#71717a`, red `#ef4444`, amber `#f59e0b`, lime `#84cc16`, emerald `#10b981`, sky `#0ea5e9`, blue `#3b82f6`, violet `#8b5cf6`) of them for the components of Fyr. If you wish, you can activate other colors or define new colors.

You can add new values to "TColors" in the [src/types/colors.type.ts](src/types/colors.type.ts) file for use in the project and don't forget to add them to the [safelist](https://tailwindcss.com/docs/content-configuration#safelisting-classes).

# Theme Configure

You can edit the theme's settings in the [src/config/theme.config.ts](src/config/theme.config.ts) file.

# Pages Configure

```tsx
export const examplePages = {
	parentPage: {
		id: 'parentPage',
		to: '/parent-page',
		text: 'Parent Page',
		icon: 'HeroBookOpen',
		subPages: {
			childPage1: {
				id: 'childPage',
				to: '/parent-page/child-page',
				text: 'Child Page',
				icon: 'HeroBookOpen',
			},
			childPage2: {
				id: 'childPage2',
				to: '/parent-page/child-page-2',
				text: 'Child Page 2',
				icon: 'HeroBookOpen',
			},
		},
	},
};
```

If you save your page information in the above format in the [src/config/pages.config.ts](src/config/pages.config.ts) file, you can easily use it in the menus.

# Architecture of the project

## src/index.tsx

```tsx
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<ThemeContextProvider>
			<BrowserRouter>
				<AuthProvider>
					<App />
				</AuthProvider>
			</BrowserRouter>
		</ThemeContextProvider>
	</React.StrictMode>,
);
```

### src/App/App.tsx

```tsx
return (
	<div data-component-name='App' className='flex grow flex-col'>
		<AsideRouter />
		<Wrapper>
			<HeaderRouter />
			<ContentRouter />
			<FooterRouter />
		</Wrapper>
	</div>
);
```

#### src/components/router/AsideRouter.tsx

If you do not want to customize the project in this file, you do not need to make any changes. In this component, only [src/routes/asideRoutes.tsx](src/routes/asideRoutes.tsx) file sets which component will be shown in which path.

```tsx
const asideRoutes: RouteProps[] = [
	{ path: authPages.loginPage.to, element: null },
	{ path: '*', element: <DefaultAsideTemplate /> },
];
```

You can set the "Aside Templates" to be displayed on the paths you want. If you don't want any "Aside" in a path, you can set the element to `null`.

#### src/components/router/HeaderRouter.tsx

If you do not want to customize the project in this file, you do not need to make any changes. In this component, only [src/routes/headerRoutes.tsx](src/routes/headerRoutes.tsx) file sets which component will be shown in which path.

```tsx
const headerRoutes: RouteProps[] = [
	{ path: authPages.loginPage.to, element: null },
	{
		path: `${componentsPages.uiPages.to}/*`,
		element: <ComponentAndTemplateHeaderTemplate />,
	},
	{ path: '', element: null },
	{ path: '*', element: <DefaultHeaderTemplate /> },
];
```

You can set the "Header Templates" to be displayed on the paths you want. If you don't want any "Header" in a path, you can set the element to `null`.

If you will have data about the page in "Header", specify that there will not be any "Header" in that path with `null` and define it within the page. So you don't have to worry about moving the data up.

#### src/components/router/ContentRouter.tsx

You can use [React Lazy](https://react.dev/reference/react/lazy#lazy) when importing pages.

```tsx
const contentRoutes: RouteProps[] = [
	{ path: authPages.loginPage.to, element: <LoginPage /> },
	{ path: authPages.profilePage.to, element: <ProfilePage /> },
	{ path: examplePages.duotoneIconsPage.to, element: <IconsPage /> },
	{ path: '*', element: <NotFoundPage /> },
];
```

##### Example Page

```tsx
import React from 'react';
import PageWrapper from '../components/layouts/PageWrapper/PageWrapper';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../components/layouts/Subheader/Subheader';
import Container from '../components/layouts/Container/Container';

const ExamplePage = () => {
	return (
		<PageWrapper>
			<Subheader>
				<SubheaderLeft>SubheaderLeft</SubheaderLeft>
				<SubheaderRight>SubheaderRight</SubheaderRight>
			</Subheader>
			<Container>Container</Container>
		</PageWrapper>
	);
};

export default ExamplePage;
```

You can use this method on pages where you set the null value for "Header" as described in the [src/routes/headerRoutes.tsx](#srccomponentsrouterheaderroutertsx) section.

```tsx
import React from 'react';
import Header, { HeaderLeft, HeaderRight } from '../components/layouts/Header/Header';
import PageWrapper from '../components/layouts/PageWrapper/PageWrapper';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../components/layouts/Subheader/Subheader';
import Container from '../components/layouts/Container/Container';

const ExamplePage = () => {
	return (
		<>
			<Header>
				<HeaderLeft>HeaderLeft</HeaderLeft>
				<HeaderRight>HeaderRight</HeaderRight>
			</Header>
			<PageWrapper>
				<Subheader>
					<SubheaderLeft>SubheaderLeft</SubheaderLeft>
					<SubheaderRight>SubheaderRight</SubheaderRight>
				</Subheader>
				<Container>Container</Container>
			</PageWrapper>
		</>
	);
};

export default ExamplePage;
```

#### src/components/router/FooterRouter.tsx

If you do not want to customize the project in this file, you do not need to make any changes. In this component, only [src/routes/footerRoutes.tsx](src/routes/footerRoutes.tsx) file sets which component will be shown in which path.

```tsx
const footerRoutes: RouteProps[] = [
	{ path: authPages.loginPage.to, element: null },
	{ path: '*', element: <DefaultFooterTemplate /> },
];
```

You can set the "Footer Templates" to be displayed on the paths you want. If you don't want any "Footer" in a path, you can set the element to `null`.

If you will have data about the page in "Footer", specify that there will not be any "Footer" in that path with `null` and define it within the page. So you don't have to worry about moving the data up.
#   A l l u m s m i t h  
 