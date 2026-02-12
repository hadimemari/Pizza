export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Pizza {
  id: string;
  name: string;
  price: string;
  cheesiness: number;
  ingredients: string[];
  description: string;
  image: string;
  category: string;
  reviews: Review[];
}

export const PIZZAS: Pizza[] = [
  {
    id: "1",
    name: "مارگاریتا کلاسیک",
    price: "۱۴۹,۰۰۰ تومان",
    cheesiness: 85,
    ingredients: ["ریحان تازه", "پنیر موزارلا", "سس گوجه", "روغن زیتون"],
    description: "کلاسیک بی نظیر ایتالیایی با موزارلای تازه و برگ‌های معطر ریحان که روی خمیری ترد و نازک چیده شده است.",
    image: "/pizzas/margherita.png",
    category: "pizzas",
    reviews: [
      { id: "r1", userName: "امیررضا", rating: 5, comment: "واقعاً طعم اصیلی داشت، ممنون از پیتزا موشن.", date: "۱۴۰۲/۱۰/۱۲" },
      { id: "r2", userName: "سارا", rating: 4, comment: "پنیرش خیلی کشسان و لذیذ بود.", date: "۱۴۰۲/۱۰/۱۵" }
    ]
  },
  {
    id: "2",
    name: "پپرونی دوبل",
    price: "۱۶۹,۰۰۰ تومان",
    cheesiness: 92,
    ingredients: ["سلامی تند", "پنیر اضافه", "سبزیجات معطر", "آویشن"],
    description: "رویای عاشقان گوشت با پپرونی ترد و پنیر دوبل کشسان که با هر گاز، طعمی تند و به یاد ماندنی را تجربه می‌کنید.",
    image: "/pizzas/pepperoni.png",
    category: "pizzas",
    reviews: [
      { id: "r3", userName: "رضا", rating: 5, comment: "بهترین پپرونی که تا حالا خوردم! تندی‌اش عالیه.", date: "۱۴۰۲/۱۱/۰۵" },
      { id: "r4", userName: "مریم", rating: 5, comment: "داغ و سریع رسید، عالی بود.", date: "۱۴۰۲/۱۱/۰۸" }
    ]
  },
  {
    id: "3",
    name: "سبزیجات رست شده",
    price: "۱۵۴,۰۰۰ تومان",
    cheesiness: 70,
    ingredients: ["فلفل دلمه", "زیتون", "قارچ", "پیاز قرمز"],
    description: "ترکیبی رنگارنگ از سبزیجات تازه رست شده روی خمیر ترد طلایی، انتخابی سالم و سرشار از طعم‌های طبیعی.",
    image: "/pizzas/veggie.png",
    category: "pizzas",
    reviews: [
      { id: "r5", userName: "علی", rating: 4, comment: "برای کسانی که پیتزا سنگین دوست ندارند عالیه.", date: "۱۴۰۲/۱۱/۱۰" }
    ]
  },
  {
    id: "4",
    name: "جوجه کباب (BBQ)",
    price: "۱۷۹,۰۰۰ تومان",
    cheesiness: 80,
    ingredients: ["جوجه گریل", "سس باربیکیو", "ذرت", "گشنیز"],
    description: "طعم دودی سس باربیکیو همراه با مرغ گریل شده نرم و لذیذ، تجربه‌ای متفاوت از ترکیب پیتزا و کباب.",
    image: "/pizzas/bbq.png",
    category: "pizzas",
    reviews: [
      { id: "r6", userName: "پرهام", rating: 5, comment: "سس باربیکیو بی‌نظیر بود.", date: "۱۴۰۲/۱۱/۱۵" }
    ]
  },
  {
    id: "5",
    name: "هاوایی استوایی",
    price: "۱۵۹,۰۰۰ تومان",
    cheesiness: 75,
    ingredients: ["آناناس", "ژامبون", "پیاز کاراملی", "عسل"],
    description: "شیرینی آناناس و شوری ژامبون یک تضاد طعم استوایی بی‌نظیر که ذائقه شما را به سفری در سواحل هاوایی می‌برد.",
    image: "/pizzas/hawaiian.png",
    category: "pizzas",
    reviews: [
      { id: "r7", userName: "رویا", rating: 3, comment: "طعم خاصی داره که ممکنه همه نپسندن، ولی برای من جالب بود.", date: "۱۴۰۲/۱۱/۲۰" }
    ]
  }
];

export const CATEGORIES = [
  { id: "pizzas", label: "برش‌های پیتزا", icon: "Pizza" },
  { id: "calzones", label: "کالزونه", icon: "ChefHat" },
  { id: "sides", label: "سالادها", icon: "Salad" },
  { id: "beverages", label: "نوشیدنی", icon: "CupSoda" }
];
