const WISHLIST_KEY_PREFIX = "wishlist:"

function keyForUser(userKey: string): string {
  return `${WISHLIST_KEY_PREFIX}${userKey}`
}

export function getWishlistProductIds(userKey: string): Array<string | number> {
  if (typeof window === "undefined") return []

  const raw = localStorage.getItem(keyForUser(userKey))
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id) => typeof id === "number" || typeof id === "string")
  } catch {
    return []
  }
}

export function isWishlisted(userKey: string, productId: string | number): boolean {
  return getWishlistProductIds(userKey).includes(productId)
}

export function toggleWishlistProduct(
  userKey: string,
  productId: string | number,
): { ids: Array<string | number>; added: boolean } {
  const current = getWishlistProductIds(userKey)
  const exists = current.includes(productId)
  const next = exists
    ? current.filter((id) => id !== productId)
    : [...current, productId]

  localStorage.setItem(keyForUser(userKey), JSON.stringify(next))
  return { ids: next, added: !exists }
}
