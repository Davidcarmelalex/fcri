import RoutePage from '@/components/RoutePage';

export default function JusticePage() {
  return (
    <RoutePage
      eyebrow="Justice"
      title="Justice Systems Beyond Institutions"
      description="The justice hub connects legal protection, rights infrastructure, and the Proof-of-Justice research line."
      highlights={[
        {
          title: 'Broken Shield',
          body: 'The primary justice system page for the site.',
        },
        {
          title: 'Proof-of-Justice',
          body: 'A framework for evidence-led decision making and decentralized legal logic.',
        },
        {
          title: 'Public Safety',
          body: 'The page acts as a public entry point for legal and rights-related work.',
        },
      ]}
      links={[
        {
          href: '/justice/broken-shield',
          label: 'Broken Shield',
          body: 'Go to the justice system project page.',
        },
        {
          href: '/research/papers/proof-of-justice',
          label: 'Research',
          body: 'Read the research paper underlying the system.',
        },
      ]}
    />
  );
}
