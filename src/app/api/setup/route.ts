import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/db";

async function createTables() {
  // Each statement must be executed separately for PgBouncer compatibility
  const statements = [
    // Users
    `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL, "phone" TEXT NOT NULL, "name" TEXT, "role" TEXT NOT NULL DEFAULT 'CUSTOMER', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "User_pkey" PRIMARY KEY ("id"))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone")`,

    // OTP
    `CREATE TABLE IF NOT EXISTS "OtpCode" ("id" TEXT NOT NULL, "phone" TEXT NOT NULL, "code" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "used" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" TEXT, CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id"))`,
    `CREATE INDEX IF NOT EXISTS "OtpCode_phone_code_idx" ON "OtpCode"("phone", "code")`,

    // Category
    `CREATE TABLE IF NOT EXISTS "Category" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "slug" TEXT NOT NULL, "icon" TEXT NOT NULL, "sortOrder" INTEGER NOT NULL DEFAULT 0, CONSTRAINT "Category_pkey" PRIMARY KEY ("id"))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug")`,

    // Product
    `CREATE TABLE IF NOT EXISTS "Product" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "price" INTEGER NOT NULL, "description" TEXT NOT NULL, "image" TEXT NOT NULL, "ingredients" TEXT NOT NULL, "isAvailable" BOOLEAN NOT NULL DEFAULT true, "sortOrder" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "categoryId" TEXT NOT NULL, CONSTRAINT "Product_pkey" PRIMARY KEY ("id"))`,
    `CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId")`,

    // Review
    `CREATE TABLE IF NOT EXISTS "Review" ("id" TEXT NOT NULL, "rating" INTEGER NOT NULL, "comment" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" TEXT NOT NULL, "productId" TEXT NOT NULL, CONSTRAINT "Review_pkey" PRIMARY KEY ("id"))`,
    `CREATE INDEX IF NOT EXISTS "Review_productId_idx" ON "Review"("productId")`,

    // Cart
    `CREATE TABLE IF NOT EXISTS "Cart" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Cart_pkey" PRIMARY KEY ("id"))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Cart_userId_key" ON "Cart"("userId")`,

    // CartItem
    `CREATE TABLE IF NOT EXISTS "CartItem" ("id" TEXT NOT NULL, "quantity" INTEGER NOT NULL DEFAULT 1, "cartId" TEXT NOT NULL, "productId" TEXT NOT NULL, CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id"))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "CartItem_cartId_productId_key" ON "CartItem"("cartId", "productId")`,

    // Order
    `CREATE TABLE IF NOT EXISTS "Order" ("id" TEXT NOT NULL, "orderNumber" INTEGER NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING', "totalAmount" INTEGER NOT NULL, "note" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" TEXT NOT NULL, CONSTRAINT "Order_pkey" PRIMARY KEY ("id"))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "Order"("orderNumber")`,
    `CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId")`,
    `CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status")`,

    // OrderItem
    `CREATE TABLE IF NOT EXISTS "OrderItem" ("id" TEXT NOT NULL, "quantity" INTEGER NOT NULL, "unitPrice" INTEGER NOT NULL, "orderId" TEXT NOT NULL, "productId" TEXT NOT NULL, CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id"))`,

    // Payment
    `CREATE TABLE IF NOT EXISTS "Payment" ("id" TEXT NOT NULL, "amount" INTEGER NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING', "gateway" TEXT, "transactionId" TEXT, "refId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "orderId" TEXT NOT NULL, CONSTRAINT "Payment_pkey" PRIMARY KEY ("id"))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Payment_orderId_key" ON "Payment"("orderId")`,
  ];

  for (const sql of statements) {
    await db.$executeRawUnsafe(sql);
  }
}

async function addForeignKeys() {
  const fkeys = [
    `DO $$ BEGIN ALTER TABLE "OtpCode" ADD CONSTRAINT "OtpCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    `DO $$ BEGIN ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    `DO $$ BEGIN ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    `DO $$ BEGIN ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    `DO $$ BEGIN ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    `DO $$ BEGIN ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    `DO $$ BEGIN ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    `DO $$ BEGIN ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    `DO $$ BEGIN ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    `DO $$ BEGIN ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    `DO $$ BEGIN ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  ];

  for (const sql of fkeys) {
    await db.$executeRawUnsafe(sql);
  }
}

// One-time database setup endpoint
// Creates tables + seeds data
// Protected by NEXTAUTH_SECRET as setup key
export async function POST(req: NextRequest) {
  const body = await req.json();
  const secret = body.secret;

  if (!secret || secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const log: string[] = [];

  try {
    // Step 1: Create tables
    log.push("Creating tables...");
    await createTables();
    log.push("Tables created.");

    // Step 2: Add foreign keys
    log.push("Adding foreign keys...");
    await addForeignKeys();
    log.push("Foreign keys added.");

    // Step 3: Check if already seeded
    const existingProducts = await db.product.count();
    if (existingProducts > 0) {
      return NextResponse.json({
        message: "Tables created, database already seeded",
        products: existingProducts,
        log,
      });
    }

    // Step 4: Seed categories
    log.push("Seeding categories...");
    const pizzas = await db.category.upsert({
      where: { slug: "pizzas" },
      update: {},
      create: { name: "برش‌های پیتزا", slug: "pizzas", icon: "Pizza", sortOrder: 0 },
    });

    const calzones = await db.category.upsert({
      where: { slug: "calzones" },
      update: {},
      create: { name: "کالزونه", slug: "calzones", icon: "ChefHat", sortOrder: 1 },
    });

    const sides = await db.category.upsert({
      where: { slug: "sides" },
      update: {},
      create: { name: "سالادها", slug: "sides", icon: "Salad", sortOrder: 2 },
    });

    const beverages = await db.category.upsert({
      where: { slug: "beverages" },
      update: {},
      create: { name: "نوشیدنی", slug: "beverages", icon: "CupSoda", sortOrder: 3 },
    });
    log.push("Categories seeded.");

    // Step 5: Seed products
    log.push("Seeding products...");
    const productsData = [
      { name: "مارگاریتا کلاسیک", price: 149000, ingredients: ["ریحان تازه", "پنیر موزارلا", "سس گوجه", "روغن زیتون"], description: "کلاسیک بی نظیر ایتالیایی با موزارلای تازه و برگ‌های معطر ریحان که روی خمیری ترد و نازک چیده شده است.", image: "/images/pizzas/p1.png", categoryId: pizzas.id, sortOrder: 0 },
      { name: "پپرونی دوبل", price: 169000, ingredients: ["سلامی تند", "پنیر اضافه", "سبزیجات معطر", "آویشن"], description: "رویای عاشقان گوشت با پپرونی ترد و پنیر دوبل کشسان که با هر گاز، طعمی تند و به یاد ماندنی را تجربه می‌کنید.", image: "/images/pizzas/p2.png", categoryId: pizzas.id, sortOrder: 1 },
      { name: "سبزیجات رست شده", price: 155000, ingredients: ["فلفل دلمه", "قارچ", "ذرت شیرین", "زیتون سیاه"], description: "ترکیب رنگارنگ و سالم از سبزیجات تازه فصل که در دمای بالا رست شده‌اند.", image: "/images/pizzas/p3.png", categoryId: pizzas.id, sortOrder: 2 },
      { name: "مرغ باربیکیو ویژه", price: 175000, ingredients: ["مرغ گریل شده", "سس باربیکیو دودی", "پیاز قرمز", "ذرت"], description: "طعم لذیذ مرغ گریل شده همراه با سس مخصوص باربیکیو که در تنور سنگی برشته شده است.", image: "/images/pizzas/p4.png", categoryId: pizzas.id, sortOrder: 3 },
      { name: "کالزونه گوشت و قارچ", price: 189000, ingredients: ["گوشت چرخ‌کرده", "قارچ اسلایس", "فلفل دلمه", "پنیر اضافه"], description: "یک پیراشکی غول‌آسا پر از مواد گوشتی و پنیر فراوان که در تنور سنگی برشته شده است.", image: "/images/calzones/cal1.png", categoryId: calzones.id, sortOrder: 0 },
      { name: "کالزونه اسفناج و پنیر", price: 165000, ingredients: ["اسفناج تازه", "پنیر فتا", "پیاز کاراملی", "گردو"], description: "ترکیب خوشمزه سبزیجات معطر و پنیرهای مدیترانه‌ای در دل یک خمیر ترد و داغ.", image: "/images/calzones/cal2.png", categoryId: calzones.id, sortOrder: 1 },
      { name: "سالاد سزار ویژه", price: 125000, ingredients: ["کاهو رسمی", "مرغ گریل", "پنیر پارمزان", "سس مخصوص"], description: "سالاد سزار کلاسیک با فیله مرغ گریل شده و سس دست‌ساز سرآشپز.", image: "/images/sides/sal1.png", categoryId: sides.id, sortOrder: 0 },
      { name: "فتوش لبنانی", price: 95000, ingredients: ["خیار", "گوجه", "نان سوخاری", "سماق"], description: "یک سالاد مدیترانه‌ای خنک و ترش که همراه عالی برای پیتزاهای شماست.", image: "/images/sides/sal2.png", categoryId: sides.id, sortOrder: 1 },
      { name: "موخیتو طبیعی", price: 65000, ingredients: ["نعناع تازه", "لیمو", "شکر قهوه‌ای", "سودا"], description: "نوشیدنی خنک و دست‌ساز با طعم نعناع و لیموی تازه.", image: "/images/beverages/bev1.png", categoryId: beverages.id, sortOrder: 0 },
      { name: "لیموناد خونگی", price: 55000, ingredients: ["لیمو سنگی", "عسل", "یخ فراوان"], description: "ترکیب ترش و شیرین لیموی تازه برای رفع عطش بعد از یک غذای داغ.", image: "/images/beverages/bev2.png", categoryId: beverages.id, sortOrder: 1 },
    ];

    for (const p of productsData) {
      await db.product.create({
        data: { ...p, ingredients: JSON.stringify(p.ingredients) },
      });
    }
    log.push(`${productsData.length} products seeded.`);

    // Step 6: Seed users
    log.push("Seeding users...");
    await db.user.upsert({
      where: { phone: "09120000000" },
      update: {},
      create: { phone: "09120000000", name: "مدیر سیستم", role: "ADMIN" },
    });

    const user1 = await db.user.upsert({
      where: { phone: "09121111111" },
      update: {},
      create: { phone: "09121111111", name: "امیررضا" },
    });

    const user2 = await db.user.upsert({
      where: { phone: "09122222222" },
      update: {},
      create: { phone: "09122222222", name: "سارا" },
    });

    const user3 = await db.user.upsert({
      where: { phone: "09123333333" },
      update: {},
      create: { phone: "09123333333", name: "رضا" },
    });
    log.push("Users seeded.");

    // Step 7: Seed reviews
    log.push("Seeding reviews...");
    const allProducts = await db.product.findMany({ orderBy: { sortOrder: "asc" } });

    if (allProducts.length >= 2) {
      await db.review.createMany({
        data: [
          { userId: user1.id, productId: allProducts[0].id, rating: 5, comment: "واقعاً طعم اصیلی داشت، ممنون از پیتزا موشن." },
          { userId: user2.id, productId: allProducts[0].id, rating: 4, comment: "پنیرش خیلی کشسان و لذیذ بود." },
          { userId: user3.id, productId: allProducts[1].id, rating: 5, comment: "بهترین پپرونی که تا حالا خوردم! تندی‌اش عالیه." },
        ],
      });
    }
    log.push("Reviews seeded.");

    return NextResponse.json({
      message: "Database setup complete! Tables created and data seeded.",
      categories: 4,
      products: productsData.length,
      users: 4,
      reviews: 3,
      log,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Setup failed", details: String(error), log },
      { status: 500 }
    );
  }
}
