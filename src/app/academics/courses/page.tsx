import RoutePage from '@/components/RoutePage';

export default function CoursesPage() {
  return (
    <RoutePage
      eyebrow="Academics / Courses"
      title="Professional Courses"
      description="Course offerings provide structured education in the domains that power the FCRI stack."
      highlights={[
        {
          title: 'Applied Learning',
          body: 'Courses should map to systems thinking, implementation, and real operational outcomes.',
        },
        {
          title: 'Audience',
          body: 'Built for practitioners, founders, and researchers who need more than surface-level education.',
        },
        {
          title: 'Conversion Path',
          body: 'The page can later host enrollment, syllabi, and session dates.',
        },
      ]}
      links={[
        {
          href: '/academics',
          label: 'Academics',
          body: 'Return to the academic hub.',
        },
        {
          href: '/participation',
          label: 'Participation',
          body: 'See the broader mission entry points.',
        },
      ]}
    />
  );
}
