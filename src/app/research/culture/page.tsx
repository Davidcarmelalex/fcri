import RoutePage from '@/components/RoutePage';

export default function CultureResearchPage() {
  return (
    <RoutePage
      eyebrow="Research / Culture"
      title="Culture & Human Systems"
      description="Culture research looks at narrative infrastructure, information ecology, and how meaning systems shape coordination."
      highlights={[
        {
          title: 'Narrative Systems',
          body: 'Analyze the mechanics of trust, attention, and public meaning.',
        },
        {
          title: 'Information Ecology',
          body: 'Build systems that make information healthier and more legible.',
        },
        {
          title: 'Applied Culture',
          body: 'The output should feed media, creator, or community-facing work.',
        },
      ]}
      links={[
        {
          href: '/research/papers/information-ecology',
          label: 'Paper',
          body: 'Read the information ecology paper entry.',
        },
        {
          href: '/culture/soulforge',
          label: 'System',
          body: 'Open the Soulforge culture project.',
        },
      ]}
    />
  );
}
