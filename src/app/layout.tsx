import '@/app/globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  metadataBase: new URL('https://fcri.science'),
  title: {
    default: 'FCRI | Fusion Civilization Research Institute',
    template: '%s | FCRI',
  },
  description:
    'Fusion Civilization Research Institute — frontier science, civilization engineering, research, and academic programs based in Liberland.',
  keywords: [
    'research institute', 'civilization engineering', 'frontier science',
    'Liberland', 'governance', 'AI systems', 'Voltex Network',
  ],
  openGraph: {
    title: 'FCRI | Fusion Civilization Research Institute',
    description:
      'Research, publications, courses, fellowships, and institutional design for frontier science.',
    url: 'https://fcri.science',
    siteName: 'FCRI - Fusion Civilization Research Institute',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FCRI | Fusion Civilization Research Institute',
    description: 'Frontier science and civilization engineering. Based in Liberland.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <Navigation />
        <div className="pt-[65px]">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
