/**
 * EthioCraft API Client
 * Base URL: process.env.NEXT_PUBLIC_BASE_URL (e.g. http://localhost:4000/api/v1)
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api/v1";

// ─── Types returned by the backend ───────────────────────────────────────────

export type ApiMedia = {
  id: string;
  url: string;
  sortOrder: number;
};

export type ApiArtisanProfile = {
  shopName: string | null;
  bio: string | null;
  city: string | null;
  region: string | null;
};

export type ApiArtisan = {
  id: string;
  firstName: string;
  lastName: string;
  artisanProfile: ApiArtisanProfile | null;
};

export type ApiReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export type ApiProductSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  materials?: string[];
  tags: string[];
  status: string;
  publishedAt: string | null;
  media: ApiMedia[];
  artisan: ApiArtisan;
  _count: { reviews: number };
};

export type ApiProductDetail = ApiProductSummary & {
  shortDescription?: string;
  material?: string;
  dimensions?: string;
  careInstructions?: string;
  reviews: ApiReview[];
  relatedProducts: ApiProductSummary[];
  averageRating: number | null;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductListResponse = {
  items: ApiProductSummary[];
  meta: PaginationMeta;
};

export type ApiOrderItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: {
    id: string;
    title: string;
    slug: string;
  };
};

export type ApiOrder = {
  id: string;
  status: string;
  subtotalAmount: number;
  shippingFee: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
  items: ApiOrderItem[];
};

export type OrderListParams = {
  page?: number;
  limit?: number;
  status?: string;
};

export type OrderListResponse = {
  items: ApiOrder[];
  meta: PaginationMeta;
};

// ─── Query params for product list ───────────────────────────────────────────

export type ProductListParams = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "oldest" | "newest";
  page?: number;
  limit?: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns the first media URL for a product, or a placeholder. */
export function getProductImage(product: ApiProductSummary): string {
  return product.media?.[0]?.url || "/placeholder-product.jpg";
}

/** Returns the full artisan display name. */
export function getArtisanName(artisan: ApiArtisan): string {
  return `${artisan.firstName} ${artisan.lastName}`.trim();
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetch published products with optional filter/sort/pagination params.
 */
export async function fetchProducts(
  params: ProductListParams = {}
): Promise<ProductListResponse> {
  const url = new URL(`${BASE_URL}/marketplace/products`);

  if (params.search) url.searchParams.set("search", params.search);
  if (params.category) url.searchParams.set("category", params.category);
  if (params.minPrice !== undefined)
    url.searchParams.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined)
    url.searchParams.set("maxPrice", String(params.maxPrice));
  if (params.sortBy) url.searchParams.set("sortBy", params.sortBy);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  // Backend returns: { message: string, data: { items, meta } }
  return json.data as ProductListResponse;
}

/**
 * Fetch a single product by ID (or slug).
 */
export async function fetchProductById(
  idOrSlug: string
): Promise<ApiProductDetail> {
  const res = await fetch(
    `${BASE_URL}/marketplace/products/${idOrSlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch product "${idOrSlug}": ${res.status} ${res.statusText}`
    );
  }

  const json = await res.json();
  // Backend returns: { message: string, data: { ...product } }
  return json.data as ApiProductDetail;
}

export async function fetchOrders(
  token: string,
  params: OrderListParams = {}
): Promise<OrderListResponse> {
  const url = new URL(`${BASE_URL}/orders`);

  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.status) url.searchParams.set("status", params.status);

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Failed to fetch orders: ${res.status}`);
  }

  const json = await res.json();
  return json.data as OrderListResponse;
}

/**
 * Submit a product review. Requires a valid JWT token.
 */
export async function submitReview(
  productId: string,
  token: string,
  payload: { rating: number; comment: string }
): Promise<ApiReview> {
  const res = await fetch(
    `${BASE_URL}/marketplace/products/${productId}/reviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Review submission failed: ${res.status}`);
  }

  const json = await res.json();
  return json.data as ApiReview;
}
