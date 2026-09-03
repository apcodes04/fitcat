import "./globals.css";

export const runtime = 'edge';

export const metadata = {
  title: "Fitcat | Fuel Your Day The Healthy Way | Vikhroli East Mumbai",
  description: "Fresh, natural, and nourishing healthy morning breakfasts at Vikhroli East Railway Station. Pre-book your Peanut Butter Banana Sandwich, Chia Pudding, Oats, and Fruit Bowls.",
  keywords: "Fitcat, healthy food, Vikhroli East, Mumbai, breakfast, chia pudding, oats, fruit bowl, healthy sandwich",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className="bg-fitcat-green text-fitcat-cream antialiased">
        {children}
      </body>
    </html>
  );
}
