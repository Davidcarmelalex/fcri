import './globals.css';

export const metadata = {
  title: 'NRLink | Wealth Without Friction',
  description: 'Elite premium cross-border liquidity infrastructure.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
