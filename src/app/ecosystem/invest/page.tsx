import RoutePage from '@/components/RoutePage';

export default function EcosystemInvestPage() {
  return (
    <RoutePage
      eyebrow="Ecosystem"
      title="Ecosystem Investment Path"
      description="This route resolves the ecosystem investment link and can later host the more specific investor narrative or intake flow."
      highlights={[
        {
          title: 'Operational Use',
          body: 'Gives the site a dedicated destination for ecosystem-side investment conversations.',
        },
        {
          title: 'Navigation Safety',
          body: 'Prevents the ecosystem hub from pointing into a dead end.',
        },
        {
          title: 'Future Proofing',
          body: 'The page can later be expanded into a structured investor or partner flow.',
        },
      ]}
      links={[
        {
          href: '/invest',
          label: 'Invest',
          body: 'See the main invest page.',
        },
        {
          href: '/ecosystem',
          label: 'Ecosystem',
          body: 'Return to the ecosystem map.',
        },
      ]}
    />
  );
}
