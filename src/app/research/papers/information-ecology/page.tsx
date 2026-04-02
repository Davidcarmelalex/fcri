import RoutePage from '@/components/RoutePage';

export default function InformationEcologyPage() {
  return (
    <RoutePage
      eyebrow="Research Paper"
      title="Information Ecology"
      description="A paper about information as an ecosystem: how narratives spread, degrade, and shape trust inside institutions."
      highlights={[
        {
          title: 'Core Idea',
          body: 'Treat information quality as an environmental and coordination problem.',
        },
        {
          title: 'Research Value',
          body: 'Useful for media, governance, and culture workstreams.',
        },
        {
          title: 'Downstream Systems',
          body: 'The paper can inform content strategy and platform design.',
        },
      ]}
      links={[
        {
          href: '/research/culture',
          label: 'Research Track',
          body: 'Return to culture research.',
        },
        {
          href: '/culture/soulforge',
          label: 'System',
          body: 'Open the culture deployment page.',
        },
      ]}
    />
  );
}
