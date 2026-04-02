import RoutePage from '@/components/RoutePage';

export default function FinancialSystemsPage() {
  return (
    <RoutePage
      eyebrow="Financial Systems"
      title="Financial Systems for Civilizational Infrastructure"
      description="This hub groups the institute's financial architecture, including autonomous engines, account systems, and the research behind them."
      highlights={[
        {
          title: 'VoltexFinance',
          body: 'Autonomous financial engine for adaptive capital flow and ecosystem support.',
        },
        {
          title: 'Fusion Veritas',
          body: 'Borderless account and identity layer designed for global participation.',
        },
        {
          title: 'Research Backbone',
          body: 'Built on Synaptic Economics and related working papers.',
        },
      ]}
      links={[
        {
          href: '/financial-systems/voltexfinance',
          label: 'VoltexFinance',
          body: 'Inspect the deployed financial engine.',
        },
        {
          href: '/financial-systems/fusion-veritas',
          label: 'Fusion Veritas',
          body: 'Review the account system and infrastructure layer.',
        },
      ]}
    />
  );
}
