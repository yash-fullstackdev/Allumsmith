import { useState } from 'react';

const getUserRights = (module:string) => {
  
	const userData: any = localStorage.getItem('module');
	
  const parsedUserData = JSON.parse(userData);
 
  
  
  
  const canRead = () => {
    return parsedUserData[module] && parsedUserData[module].read;
  };

  const canWrite = () => {
    return parsedUserData[module] && parsedUserData[module].write;
  };

  const canDelete = () => {
    return parsedUserData[module] && parsedUserData[module].delete;
  };

  return {
    canRead,
    canWrite,
    canDelete,
  };
};

export default getUserRights;