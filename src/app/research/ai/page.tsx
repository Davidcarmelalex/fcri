import RoutePage from '@/components/RoutePage';

export default function AIPage() {
  return (
    <RoutePage
      eyebrow="Research / AI"
      title="AI & Machine Systems"
      description="This track considers AI as a civilizational layer: systems that assist, automate, and extend human capacity."
      highlights={[
        {
          title: 'Machine Intelligence',
          body: 'Context-aware systems, automation, and assistive interfaces.',
        },
        {
          title: 'Alignment and Ethics',
          body: 'The work should address safety, accountability, and incentives.',
        },
        {
          title: 'Productization',
          body: 'Research should be close enough to implementation to be useful.',
        },
      ]}
      links={[
        {
          href: '/research/papers/sentient-computing',
          label: 'Paper',
          body: 'Read the sentient computing paper entry.',
        },
        {
          href: '/ecosystem/voltexbazar',
          label: 'System',
          body: 'See the marketplace layer that applies AI operationally.',
        },
      ]}
    />
  );
}
