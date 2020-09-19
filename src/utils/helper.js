export const shortenHex = (str, count = 4) => {
  const len = str.length;
  return `0x${str.substr(2, count)}...${str.substr(len - count, len - 1)}`;
};