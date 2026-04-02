import RoutePage from '@/components/RoutePage';

export default function CivilizationPage() {
  return (
    <RoutePage
      eyebrow="Research / Civilization"
      title="Civilization Architecture"
      description="Civilization architecture connects governance, finance, culture, and intelligence into a coherent systems model."
      highlights={[
        {
          title: 'Systems Thinking',
          body: 'The work is about coordination across institutions, not isolated theory.',
        },
        {
          title: 'Fusion Civilization',
          body: 'A candidate framework for how human-machine systems could be organized.',
        },
        {
          title: 'Deployment Path',
          body: 'Best results should point to concrete institutional and product decisions.',
        },
      ]}
      links={[
        {
          href: '/research/papers/fusion-civilization',
          label: 'Paper',
          body: 'Open the fusion civilization paper entry.',
        },
        {
          href: '/about',
          label: 'About',
          body: 'See the broader institutional story.',
        },
      ]}
    />
  );
}
