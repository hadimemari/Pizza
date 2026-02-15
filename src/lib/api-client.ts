// ──────────────────────────────────────────
// Client-side API Helper
// ──────────────────────────────────────────

const BASE = "";

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`${BASE}${url}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json.error || "خطای ناشناخته" };
    }

    return { data: json as T, error: null };
  } catch {
    return { data: null, error: "خطا در ارتباط با سرور" };
  }
}

// ── Auth ──
export const api = {
  auth: {
    sendOtp: (phone: string) =>
      request<{ message: string; isNewUser: boolean; debug_code?: string }>("/api/auth/otp/send", {
        method: "POST",
        body: JSON.stringify({ phone }),
      }),

    verifyOtp: (phone: string, code: string, name?: string) =>
      request<{
        message: string;
        user: { id: string; name: string; phone: string; role: string };
      }>("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code, name }),
      }),

    me: () =>
      request<{
        user: { id: string; name: string; phone: string; role: string } | null;
      }>("/api/auth/me"),

    logout: () => request<{ message: string }>("/api/auth/me", { method: "DELETE" }),
  },

  // ── Products ──
  products: {
    list: (category?: string) =>
      request<{
        products: Array<{
          id: string;
          name: string;
          price: number;
          description: string;
          image: string;
          ingredients: string[];
          isAvailable: boolean;
          category: { id: string; name: string; slug: string };
          reviews: Array<{
            id: string;
            rating: number;
            comment: string;
            createdAt: string;
            user: { name: string };
          }>;
        }>;
      }>(`/api/products${category ? `?category=${category}` : ""}`),
  },

  // ── Categories ──
  categories: {
    list: () =>
      request<{
        categories: Array<{
          id: string;
          name: string;
          slug: string;
          icon: string;
          _count: { products: number };
        }>;
      }>("/api/categories"),
  },

  // ── Cart ──
  cart: {
    get: () =>
      request<{
        items: Array<{
          id: string;
          quantity: number;
          product: { id: string; name: string; price: number; image: string; isAvailable: boolean };
        }>;
        total: number;
      }>("/api/cart"),

    add: (productId: string, quantity: number = 1) =>
      request<{ message: string }>("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      }),

    update: (itemId: string, quantity: number) =>
      request<{ message: string }>(`/api/cart?itemId=${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      }),

    clear: () => request<{ message: string }>("/api/cart", { method: "DELETE" }),
  },

  // ── Orders ──
  orders: {
    list: () =>
      request<{
        orders: Array<{
          id: string;
          orderNumber: number;
          status: string;
          totalAmount: number;
          note: string | null;
          createdAt: string;
          items: Array<{
            id: string;
            quantity: number;
            unitPrice: number;
            product: { name: string; image: string };
          }>;
          payment: { status: string; gateway: string; refId: string } | null;
          user: { name: string; phone: string };
        }>;
      }>("/api/orders"),

    create: (note?: string, addressId?: string) =>
      request<{
        message: string;
        order: { id: string; orderNumber: number; subtotal: number; tax: number; deliveryFee: number; totalAmount: number; status: string };
      }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({ note, addressId }),
      }),
  },

  // ── Payment ──
  payment: {
    request: (orderId: string) =>
      request<{
        message: string;
        payment: { id: string; status: string; refId: string };
      }>("/api/payment/request", {
        method: "POST",
        body: JSON.stringify({ orderId }),
      }),
  },

  // ── Profile ──
  profile: {
    get: () =>
      request<{
        user: {
          id: string; phone: string; name: string | null;
          firstName: string | null; lastName: string | null;
          email: string | null; avatarUrl: string | null;
          birthYear: number | null; birthMonth: number | null; birthDay: number | null;
          defaultOrderNote: string | null; loyaltyPoints: number;
          loyaltyTier: string; totalOrders: number; totalSpent: number;
          referralCode: string | null; smsOptIn: boolean;
          preferredPayment: string | null; createdAt: string;
          lastOrderAt: string | null;
          addresses: Array<{
            id: string; title: string; province: string; city: string;
            neighborhood: string; street: string; postalCode: string | null;
            isDefault: boolean;
          }>;
          favorites: Array<{
            id: string; title: string;
            items: Array<{
              id: string; quantity: number;
              product: { id: string; name: string; price: number; image: string; isAvailable: boolean };
            }>;
          }>;
        };
        completeness: number;
      }>("/api/profile"),

    update: (data: Record<string, unknown>) =>
      request<{ message: string }>("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  // ── Addresses ──
  addresses: {
    list: () =>
      request<{
        addresses: Array<{
          id: string; title: string; province: string; city: string;
          neighborhood: string; street: string; postalCode: string | null;
          isDefault: boolean;
        }>;
      }>("/api/addresses"),

    create: (data: Record<string, unknown>) =>
      request<{ message: string }>("/api/addresses", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Record<string, unknown>) =>
      request<{ message: string }>(`/api/addresses?id=${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    remove: (id: string) =>
      request<{ message: string }>(`/api/addresses?id=${id}`, {
        method: "DELETE",
      }),
  },

  // ── Favorites (سفارش همیشگی) ──
  favorites: {
    list: () =>
      request<{
        favorites: Array<{
          id: string; title: string; totalAmount: number;
          items: Array<{
            id: string; quantity: number;
            product: { id: string; name: string; price: number; image: string; isAvailable: boolean };
          }>;
        }>;
      }>("/api/favorites"),

    create: (title: string, items: Array<{ productId: string; quantity: number }>) =>
      request<{ message: string }>("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ title, items }),
      }),

    remove: (id: string) =>
      request<{ message: string }>(`/api/favorites?id=${id}`, {
        method: "DELETE",
      }),

    toggle: (productId: string) =>
      request<{ favorited: boolean; message: string }>("/api/favorites/toggle", {
        method: "POST",
        body: JSON.stringify({ productId }),
      }),
  },
};
