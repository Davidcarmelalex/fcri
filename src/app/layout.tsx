import '@/app/globals.css';
import Head from '@/components/Head';

export const metadata = {
  metadataBase: new URL('https://fcri.science'),
  title: 'FCRI | Fusion Civilization Research Institute',
  description:
    'Fusion Civilization Research Institute is a frontier science and civilization engineering institute based out of Liberland.',
  openGraph: {
    title: 'FCRI | Fusion Civilization Research Institute',
    description:
      'Research, publications, courses, fellowships, and institutional design for frontier science.',
    url: 'https://fcri.science',
    siteName: 'FCRI - Fusion Civilization Research Institute',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head />
      <body className="antialiased">{children}</body>
    </html>
  );
}
