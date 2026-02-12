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
  // پیتزاها - مسیر تصاویر: public/images/pizzas/
  {
    id: "1",
    name: "مارگاریتا کلاسیک",
    price: "۱۴۹,۰۰۰ تومان",
    cheesiness: 85,
    ingredients: ["ریحان تازه", "پنیر موزارلا", "سس گوجه", "روغن زیتون"],
    description: "کلاسیک بی نظیر ایتالیایی با موزارلای تازه و برگ‌های معطر ریحان که روی خمیری ترد و نازک چیده شده است.",
    image: "/images/pizzas/1.png",
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
    image: "/images/pizzas/2.png",
    category: "pizzas",
    reviews: [
      { id: "r3", userName: "رضا", rating: 5, comment: "بهترین پپرونی که تا حالا خوردم! تندی‌اش عالیه.", date: "۱۴۰۲/۱۱/۰۵" }
    ]
  },
  // کالزونه - مسیر تصاویر: public/images/calzones/
  {
    id: "c1",
    name: "کالزونه گوشت و قارچ",
    price: "۱۸۹,۰۰۰ تومان",
    cheesiness: 95,
    ingredients: ["گوشت چرخ‌کرده", "قارچ اسلایس", "فلفل دلمه", "پنیر اضافه"],
    description: "یک پیراشکی غول‌آسا پر از مواد گوشتی و پنیر فراوان که در تنور سنگی برشته شده است.",
    image: "/images/calzones/c1.png",
    category: "calzones",
    reviews: []
  },
  {
    id: "c2",
    name: "کالزونه سبزیجات",
    price: "۱۶۵,۰۰۰ تومان",
    cheesiness: 80,
    ingredients: ["اسفناج", "پنیر فتا", "پیاز کاراملی", "گردو"],
    description: "ترکیب خوشمزه سبزیجات تازه و پنیرهای معطر در دل یک خمیر ترد و داغ.",
    image: "/images/calzones/c2.png",
    category: "calzones",
    reviews: []
  },
  // سالادها - مسیر تصاویر: public/images/sides/
  {
    id: "s1",
    name: "سالاد سزار ویژه",
    price: "۱۲۵,۰۰۰ تومان",
    cheesiness: 30,
    ingredients: ["کاهو رسمی", "مرغ گریل", "پنیر پارمزان", "سس مخصوص"],
    description: "سالاد سزار کلاسیک با فیله مرغ گریل شده و سس دست‌ساز سرآشپز.",
    image: "/images/sides/s1.png",
    category: "sides",
    reviews: []
  },
  {
    id: "s2",
    name: "فتوش لبنانی",
    price: "۹۵,۰۰۰ تومان",
    cheesiness: 0,
    ingredients: ["خیار", "گوجه", "نان سوخاری", "سماق"],
    description: "یک سالاد مدیترانه‌ای خنک و ترش که همراه عالی برای پیتزاهای شماست.",
    image: "/images/sides/s2.png",
    category: "sides",
    reviews: []
  },
  // نوشیدنی‌ها - مسیر تصاویر: public/images/beverages/
  {
    id: "b1",
    name: "موخیتو طبیعی",
    price: "۶۵,۰۰۰ تومان",
    cheesiness: 0,
    ingredients: ["نعناع تازه", "لیمو", "شکر قهوه‌ای", "سودا"],
    description: "نوشیدنی خنک و دست‌ساز با طعم نعناع و لیموی تازه.",
    image: "/images/beverages/b1.png",
    category: "beverages",
    reviews: []
  },
  {
    id: "b2",
    name: "آبمیوه فصل",
    price: "۷۵,۰۰۰ تومان",
    cheesiness: 0,
    ingredients: ["میوه تازه"],
    description: "آبمیوه ۱۰۰٪ طبیعی تهیه شده از میوه‌های تازه فصل.",
    image: "/images/beverages/b2.png",
    category: "beverages",
    reviews: []
  }
];

export const CATEGORIES = [
  { id: "pizzas", label: "برش‌های پیتزا", icon: "Pizza" },
  { id: "calzones", label: "کالزونه", icon: "ChefHat" },
  { id: "sides", label: "سالادها", icon: "Salad" },
  { id: "beverages", label: "نوشیدنی", icon: "CupSoda" }
];
