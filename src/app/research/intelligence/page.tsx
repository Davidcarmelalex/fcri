import RoutePage from '@/components/RoutePage';

export default function IntelligencePage() {
  return (
    <RoutePage
      eyebrow="Research / Intelligence"
      title="Intelligence & Cognition"
      description="The intelligence track covers sentient computing, cognition, and human-AI symbiosis as infrastructure rather than novelty."
      highlights={[
        {
          title: 'Cognitive Systems',
          body: 'Research into adaptive systems that can support or extend human decision making.',
        },
        {
          title: 'Sentient Computing',
          body: 'A paper trail for context-aware intelligence and machine behavior.',
        },
        {
          title: 'Applied Interface',
          body: 'Ideas in this track should feed products, tools, or operational systems.',
        },
      ]}
      links={[
        {
          href: '/research/papers/sentient-computing',
          label: 'Paper',
          body: 'Read the sentient computing paper entry.',
        },
        {
          href: '/research',
          label: 'Research',
          body: 'Return to the research archive.',
        },
      ]}
    />
  );
}
