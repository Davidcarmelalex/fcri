import RoutePage from '@/components/RoutePage';

export default function ExecutivePage() {
  return (
    <RoutePage
      eyebrow="Academics / Executive"
      title="Executive Programs"
      description="Executive programs translate the institute's ideas into decision-making tools for leaders, operators, and policy makers."
      highlights={[
        {
          title: 'Leadership Focus',
          body: 'The curriculum should emphasize systems literacy and implementation discipline.',
        },
        {
          title: 'Applied Strategy',
          body: 'Programs are designed to move from theory to operational change quickly.',
        },
        {
          title: 'Institutional Reach',
          body: 'Useful for external partners who need an on-ramp into FCRI thinking.',
        },
      ]}
      links={[
        {
          href: '/academics',
          label: 'Academics',
          body: 'Return to the academic hub.',
        },
        {
          href: '/partnerships',
          label: 'Partnerships',
          body: 'See the institutional collaboration route.',
        },
      ]}
    />
  );
}
