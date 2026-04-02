import RoutePage from '@/components/RoutePage';

export default function GovernancePage() {
  return (
    <RoutePage
      eyebrow="Research / Governance"
      title="Governance & Law"
      description="Governance research focuses on computational law, decentralized justice, and systems that reduce ambiguity in decision-making."
      highlights={[
        {
          title: 'Legal Architecture',
          body: 'Design governance mechanisms that can scale without collapsing into bureaucracy.',
        },
        {
          title: 'Proof of Justice',
          body: 'Use evidence, logic, and accountability as system inputs.',
        },
        {
          title: 'Deployment',
          body: 'Translate theory into public-facing governance products and templates.',
        },
      ]}
      links={[
        {
          href: '/research/papers/proof-of-justice',
          label: 'Paper',
          body: 'Read the Proof-of-Justice paper.',
        },
        {
          href: '/justice/broken-shield',
          label: 'System',
          body: 'Open the justice deployment page.',
        },
      ]}
    />
  );
}
