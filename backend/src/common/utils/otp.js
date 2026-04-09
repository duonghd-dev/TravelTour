
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export const getOTPExpiration = () => {
  const now = new Date();
  return new Date(now.getTime() + 10 * 60000); 
};
