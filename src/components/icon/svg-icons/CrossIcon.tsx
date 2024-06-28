import React, { SVGProps } from 'react';

const CrossIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='1.5'
    stroke='currentColor'
    data-slot='icon'
    className='h-6 w-6'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6 18 18 6M6 6l12 12'
      strokeWidth={1.5}
    />
  </svg>
);
export default CrossIcon;