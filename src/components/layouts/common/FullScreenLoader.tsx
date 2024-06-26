const FullScreenLoader = () => {
	return (
		<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white '>
			<div className='h-16 w-16 animate-spin rounded-full border-[6px] border-b-blue-500'></div>
		</div>
	);
};

export default FullScreenLoader;
