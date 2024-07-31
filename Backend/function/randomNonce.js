function generateRandomString(length) {
  const digits = '0123456789';
  let result = '';
  const digitsLength = digits.length;
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digitsLength));
  }
  return result;
}
module.exports= generateRandomString;