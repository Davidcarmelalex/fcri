import RoutePage from '@/components/RoutePage';

export default function CulturePage() {
  return (
    <RoutePage
      eyebrow="Culture"
      title="Culture as Infrastructure"
      description="FCRI treats culture as a deployment surface: narrative, media, and creator systems shape how institutions hold together."
      highlights={[
        {
          title: 'Soulforge',
          body: 'The cultural production and artist-economy layer of the stack.',
        },
        {
          title: 'Information Ecology',
          body: 'How narrative systems influence trust, coordination, and public behavior.',
        },
        {
          title: 'Applied Expression',
          body: 'Projects should make the mission visible, memorable, and shareable.',
        },
      ]}
      links={[
        {
          href: '/culture/soulforge',
          label: 'Soulforge',
          body: 'Open the main culture project page.',
        },
        {
          href: '/research/culture',
          label: 'Research',
          body: 'Review the research layer that informs culture work.',
        },
      ]}
    />
  );
}
