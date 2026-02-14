// ──────────────────────────────────────────
// تبدیل داده API به فرمت کامپوننت‌های فعلی
// ──────────────────────────────────────────

export interface MappedReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MappedProduct {
  id: string;
  name: string;
  price: string;      // "۱۴۹,۰۰۰ تومان"
  priceRaw: number;   // 149000
  ingredients: string[];
  description: string;
  image: string;
  category: string;
  reviews: MappedReview[];
  isAvailable: boolean;
}

export interface MappedCategory {
  id: string;
  label: string;
  icon: string;
}

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR") + " تومان";
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fa-IR");
  } catch {
    return "";
  }
}

export function mapProduct(p: {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  ingredients: string[];
  isAvailable: boolean;
  category: { slug: string };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: { name: string };
  }>;
}): MappedProduct {
  return {
    id: p.id,
    name: p.name,
    price: formatPrice(p.price),
    priceRaw: p.price,
    ingredients: p.ingredients,
    description: p.description,
    image: p.image,
    category: p.category.slug,
    isAvailable: p.isAvailable,
    reviews: p.reviews.map((r) => ({
      id: r.id,
      userName: r.user.name,
      rating: r.rating,
      comment: r.comment,
      date: formatDate(r.createdAt),
    })),
  };
}

export function mapCategory(c: {
  slug: string;
  name: string;
  icon: string;
}): MappedCategory {
  return {
    id: c.slug,
    label: c.name,
    icon: c.icon,
  };
}
