export const metadata = {
  title: 'NRLink | Wealth Without Friction',
  description: 'Premium cross-border liquidity infrastructure.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
