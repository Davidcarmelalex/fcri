export const metadata = {
  title: 'MR NOTHING Command Center',
  description: 'For Hustlers. Dreamers. Builders.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
