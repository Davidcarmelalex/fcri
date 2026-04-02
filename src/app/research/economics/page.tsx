import RoutePage from '@/components/RoutePage';

export default function EconomicsPage() {
  return (
    <RoutePage
      eyebrow="Research / Economics"
      title="Economics & Finance"
      description="This track builds the economic logic behind adaptive capital flow, autonomous liquidity, and post-banking finance."
      highlights={[
        {
          title: 'Synaptic Economics',
          body: 'A neural-network model for value flow and market feedback.',
        },
        {
          title: 'Systems Finance',
          body: 'Economic design should support the broader civilization stack.',
        },
        {
          title: 'Operational Linkage',
          body: 'Research here connects directly to financial products and support layers.',
        },
      ]}
      links={[
        {
          href: '/research/papers/synaptic-economics',
          label: 'Paper',
          body: 'Open the Synaptic Economics working paper.',
        },
        {
          href: '/financial-systems/voltexfinance',
          label: 'System',
          body: 'Inspect the financial deployment layer.',
        },
      ]}
    />
  );
}
