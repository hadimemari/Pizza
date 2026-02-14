import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check if already seeded
  const productCount = await prisma.product.count();
  if (productCount > 0) {
    console.log(`Database already has ${productCount} products. Skipping seed.`);
    return;
  }

  console.log("Seeding database...");

  // ── دسته‌بندی‌ها ──
  const pizzas = await prisma.category.upsert({
    where: { slug: "pizzas" },
    update: {},
    create: { name: "برش‌های پیتزا", slug: "pizzas", icon: "Pizza", sortOrder: 0 },
  });

  const calzones = await prisma.category.upsert({
    where: { slug: "calzones" },
    update: {},
    create: { name: "کالزونه", slug: "calzones", icon: "ChefHat", sortOrder: 1 },
  });

  const sides = await prisma.category.upsert({
    where: { slug: "sides" },
    update: {},
    create: { name: "سالادها", slug: "sides", icon: "Salad", sortOrder: 2 },
  });

  const beverages = await prisma.category.upsert({
    where: { slug: "beverages" },
    update: {},
    create: { name: "نوشیدنی", slug: "beverages", icon: "CupSoda", sortOrder: 3 },
  });

  // ── محصولات ──
  const productsData = [
    {
      name: "مارگاریتا کلاسیک",
      price: 149000,
      ingredients: ["ریحان تازه", "پنیر موزارلا", "سس گوجه", "روغن زیتون"],
      description: "کلاسیک بی نظیر ایتالیایی با موزارلای تازه و برگ‌های معطر ریحان که روی خمیری ترد و نازک چیده شده است.",
      image: "/images/pizzas/p1.png",
      categoryId: pizzas.id,
      sortOrder: 0,
    },
    {
      name: "پپرونی دوبل",
      price: 169000,
      ingredients: ["سلامی تند", "پنیر اضافه", "سبزیجات معطر", "آویشن"],
      description: "رویای عاشقان گوشت با پپرونی ترد و پنیر دوبل کشسان که با هر گاز، طعمی تند و به یاد ماندنی را تجربه می‌کنید.",
      image: "/images/pizzas/p2.png",
      categoryId: pizzas.id,
      sortOrder: 1,
    },
    {
      name: "سبزیجات رست شده",
      price: 155000,
      ingredients: ["فلفل دلمه", "قارچ", "ذرت شیرین", "زیتون سیاه"],
      description: "ترکیب رنگارنگ و سالم از سبزیجات تازه فصل که در دمای بالا رست شده‌اند.",
      image: "/images/pizzas/p3.png",
      categoryId: pizzas.id,
      sortOrder: 2,
    },
    {
      name: "مرغ باربیکیو ویژه",
      price: 175000,
      ingredients: ["مرغ گریل شده", "سس باربیکیو دودی", "پیاز قرمز", "ذرت"],
      description: "طعم لذیذ مرغ گریل شده همراه با سس مخصوص باربیکیو که در تنور سنگی برشته شده است.",
      image: "/images/pizzas/p4.png",
      categoryId: pizzas.id,
      sortOrder: 3,
    },
    {
      name: "کالزونه گوشت و قارچ",
      price: 189000,
      ingredients: ["گوشت چرخ‌کرده", "قارچ اسلایس", "فلفل دلمه", "پنیر اضافه"],
      description: "یک پیراشکی غول‌آسا پر از مواد گوشتی و پنیر فراوان که در تنور سنگی برشته شده است.",
      image: "/images/calzones/cal1.png",
      categoryId: calzones.id,
      sortOrder: 0,
    },
    {
      name: "کالزونه اسفناج و پنیر",
      price: 165000,
      ingredients: ["اسفناج تازه", "پنیر فتا", "پیاز کاراملی", "گردو"],
      description: "ترکیب خوشمزه سبزیجات معطر و پنیرهای مدیترانه‌ای در دل یک خمیر ترد و داغ.",
      image: "/images/calzones/cal2.png",
      categoryId: calzones.id,
      sortOrder: 1,
    },
    {
      name: "سالاد سزار ویژه",
      price: 125000,
      ingredients: ["کاهو رسمی", "مرغ گریل", "پنیر پارمزان", "سس مخصوص"],
      description: "سالاد سزار کلاسیک با فیله مرغ گریل شده و سس دست‌ساز سرآشپز.",
      image: "/images/sides/sal1.png",
      categoryId: sides.id,
      sortOrder: 0,
    },
    {
      name: "فتوش لبنانی",
      price: 95000,
      ingredients: ["خیار", "گوجه", "نان سوخاری", "سماق"],
      description: "یک سالاد مدیترانه‌ای خنک و ترش که همراه عالی برای پیتزاهای شماست.",
      image: "/images/sides/sal2.png",
      categoryId: sides.id,
      sortOrder: 1,
    },
    {
      name: "موخیتو طبیعی",
      price: 65000,
      ingredients: ["نعناع تازه", "لیمو", "شکر قهوه‌ای", "سودا"],
      description: "نوشیدنی خنک و دست‌ساز با طعم نعناع و لیموی تازه.",
      image: "/images/beverages/bev1.png",
      categoryId: beverages.id,
      sortOrder: 0,
    },
    {
      name: "لیموناد خونگی",
      price: 55000,
      ingredients: ["لیمو سنگی", "عسل", "یخ فراوان"],
      description: "ترکیب ترش و شیرین لیموی تازه برای رفع عطش بعد از یک غذای داغ.",
      image: "/images/beverages/bev2.png",
      categoryId: beverages.id,
      sortOrder: 1,
    },
  ];

  for (const p of productsData) {
    await prisma.product.create({
      data: {
        ...p,
        ingredients: JSON.stringify(p.ingredients),
      },
    });
  }

  // ── ادمین پیشفرض ──
  await prisma.user.upsert({
    where: { phone: "09120000000" },
    update: {},
    create: {
      phone: "09120000000",
      name: "مدیر سیستم",
      role: "ADMIN",
    },
  });

  // ── کاربر نمونه با نظرات ──
  const user1 = await prisma.user.upsert({
    where: { phone: "09121111111" },
    update: {},
    create: { phone: "09121111111", name: "امیررضا" },
  });

  const user2 = await prisma.user.upsert({
    where: { phone: "09122222222" },
    update: {},
    create: { phone: "09122222222", name: "سارا" },
  });

  const user3 = await prisma.user.upsert({
    where: { phone: "09123333333" },
    update: {},
    create: { phone: "09123333333", name: "رضا" },
  });

  const allProducts = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });

  if (allProducts.length >= 2) {
    await prisma.review.createMany({
      data: [
        { userId: user1.id, productId: allProducts[0].id, rating: 5, comment: "واقعاً طعم اصیلی داشت، ممنون از پیتزا موشن." },
        { userId: user2.id, productId: allProducts[0].id, rating: 4, comment: "پنیرش خیلی کشسان و لذیذ بود." },
        { userId: user3.id, productId: allProducts[1].id, rating: 5, comment: "بهترین پپرونی که تا حالا خوردم! تندی‌اش عالیه." },
      ],
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    // Don't exit(1) - let build continue even if seed fails
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
