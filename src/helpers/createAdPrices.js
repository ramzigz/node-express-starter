export default async function createAdPrices(prices, tax = 0) {
  const newPrices = [];

  for (let index = 0; index < prices.length; index += 1) {
    const { period, amount, isDefault } = prices[index];

    newPrices.push({
      period,
      total: tax + Number(amount),
      subtotal: Number(amount),
      tax,
      isDefault,
    });
  }
  return newPrices;
}
