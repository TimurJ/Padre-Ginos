const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export function priceConverter(price) {
  return intl.format(price)
}
