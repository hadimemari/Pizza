
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'پیتزا موشن | تجربه پیتزای ممتاز',
  description: 'منوی پیتزاهای لذیذ با انیمیشن‌های روان و مواد اولیه با کیفیت.',
  manifest: '/manifest.json',
  themeColor: '#E67E22',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PizzaMotion',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lalezar&family=Vazirmatn:wght@100;400;700;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="font-lalezar antialiased select-none overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
