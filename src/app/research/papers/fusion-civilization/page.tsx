import RoutePage from '@/components/RoutePage';

export default function FusionCivilizationPage() {
  return (
    <RoutePage
      eyebrow="Research Paper"
      title="Fusion Civilization Theory"
      description="A paper describing a human-machine civilization model that integrates governance, finance, AI, and culture into one stack."
      highlights={[
        {
          title: 'Core Idea',
          body: 'Civilization should be modeled as a living system with interacting subsystems.',
        },
        {
          title: 'Research Value',
          body: 'This is the conceptual layer behind the wider FCRI brand and systems map.',
        },
        {
          title: 'Downstream Systems',
          body: 'It provides the language for the site architecture and partner narrative.',
        },
      ]}
      links={[
        {
          href: '/research/civilization',
          label: 'Research Track',
          body: 'Return to the civilization domain.',
        },
        {
          href: '/about',
          label: 'About',
          body: 'Read the institutional overview.',
        },
      ]}
    />
  );
}
