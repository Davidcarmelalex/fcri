import RoutePage from '@/components/RoutePage';

export default function FellowshipsPage() {
  return (
    <RoutePage
      eyebrow="Academics / Fellowships"
      title="Fellowships"
      description="Fellowships are the deeper research track for people who want to work inside the institute's operating model."
      highlights={[
        {
          title: 'Research Work',
          body: 'Ideal for paper development, analysis, and framework synthesis.',
        },
        {
          title: 'Applied Output',
          body: 'Fellowships should produce deployable artifacts, not just credentials.',
        },
        {
          title: 'Institutional Fit',
          body: 'This route supports the long-term talent pipeline for FCRI.',
        },
      ]}
      links={[
        {
          href: '/academics',
          label: 'Academics',
          body: 'Return to the academic hub.',
        },
        {
          href: '/research',
          label: 'Research',
          body: 'Review the research base that informs the fellowship track.',
        },
      ]}
    />
  );
}
