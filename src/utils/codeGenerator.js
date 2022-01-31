export default function generateCode(n) {
  const add = 1;
  let max = 12 - add;

  if (n > max) {
    return generateCode(max) + generateCode(n - max);
  }

  max = (10 ** (n + add));
  const min = max / 10; // Math.pow(10, n) basically
  const number = Math.floor(Math.random() * (max - min + 1)) + min;

  return (`${number}`).substring(add);
}
