import CryptoJS from 'react-native-crypto-js';
import md5 from 'md5';

export const powerMod = (num, exp, mod) => {
  if (exp === 1) {
    return num % mod;
  }
  if (exp & (1 === 1)) {
    //odd
    return (num * powerMod(num, exp - 1, mod)) % mod;
  }
  return Math.pow(powerMod(num, exp / 2, mod), 2) % mod;
};

export const toNumber = (str) => {
  return str.replace(/\D/g, '').substring(0, 15);
};
const Check = async (key, compareKey) => {
  if (key === md5(compareKey)) {
    return true;
  } else {
    return false;
  }
};
