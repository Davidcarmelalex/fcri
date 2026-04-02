import RoutePage from '@/components/RoutePage';

export default function BBZPangeaPage() {
  return (
    <RoutePage
      eyebrow="Ecosystem"
      title="BBZ Pangea"
      description="A missing ecosystem destination now resolves to a live page so the movement navigation no longer lands on a 404."
      highlights={[
        {
          title: 'Ecosystem Entry',
          body: 'Useful as a placeholder for a future ecosystem product or partner initiative.',
        },
        {
          title: 'Navigation Fix',
          body: 'This closes the broken link exposed from the Movement page.',
        },
        {
          title: 'Expansion Ready',
          body: 'Can later be replaced with the real product without changing the route.',
        },
      ]}
      links={[
        {
          href: '/ecosystem',
          label: 'Ecosystem',
          body: 'Return to the ecosystem hub.',
        },
        {
          href: '/movement',
          label: 'Movement',
          body: 'See the page that links into this route.',
        },
      ]}
    />
  );
}
