import RoutePage from '@/components/RoutePage';

export default function AcademicsPage() {
  return (
    <RoutePage
      eyebrow="Academics"
      title="Academics and Programs"
      description="Courses, fellowships, seminars, and executive programs create the training layer for the institute's mission."
      highlights={[
        {
          title: 'Courses',
          body: 'Foundational and professional education around the research stack.',
        },
        {
          title: 'Fellowships',
          body: 'Focused time for researchers, builders, and operators.',
        },
        {
          title: 'Executive Programs',
          body: 'Shorter applied tracks for policy makers and organizational leaders.',
        },
      ]}
      links={[
        {
          href: '/academics/courses',
          label: 'Courses',
          body: 'Start with the education layer.',
        },
        {
          href: '/academics/fellowships',
          label: 'Fellowships',
          body: 'Review the research-focused entry point.',
        },
        {
          href: '/academics/executive',
          label: 'Executive',
          body: 'Explore the applied leadership path.',
        },
        {
          href: '/academics/seminars',
          label: 'Seminars',
          body: 'Open public-facing seminars and awareness content.',
        },
      ]}
    />
  );
}
