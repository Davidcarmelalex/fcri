import RoutePage from '@/components/RoutePage';

export default function SeminarsPage() {
  return (
    <RoutePage
      eyebrow="Academics / Seminars"
      title="Open Seminars"
      description="Seminars are the public-facing awareness layer that brings new audiences into the institute's ecosystem."
      highlights={[
        {
          title: 'Discovery Layer',
          body: 'Good seminars convert first-time visitors into engaged participants.',
        },
        {
          title: 'Topic Range',
          body: 'Can cover research, deployment, and institutional context in shorter format.',
        },
        {
          title: 'Audience Growth',
          body: 'Acts as the top of funnel for larger academic and participation tracks.',
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
          body: 'Continue into the wider mission entry points.',
        },
      ]}
    />
  );
}
