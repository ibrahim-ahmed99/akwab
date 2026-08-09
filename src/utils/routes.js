/**
 * Product detail URL: keeps the numeric id (what the API looks up) and appends
 * the slug for a readable link — e.g. /product/20/kob-albot-almmyz.
 */
export function productPath(product) {
  if (!product) return '/shop';
  const id = product.id ?? product.product_id;
  return product.slug ? `/product/${id}/${product.slug}` : `/product/${id}`;
}
