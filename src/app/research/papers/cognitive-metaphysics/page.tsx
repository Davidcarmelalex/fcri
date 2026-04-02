import RoutePage from '@/components/RoutePage';

export default function CognitiveMetaphysicsPage() {
  return (
    <RoutePage
      eyebrow="Research Paper"
      title="Cognitive Metaphysics"
      description="A paper exploring how intelligence is formed, represented, and extended inside human and machine systems."
      highlights={[
        {
          title: 'Core Idea',
          body: 'The work asks what cognition is and how systems can support it under real constraints.',
        },
        {
          title: 'Research Value',
          body: 'Useful as a bridge between intelligence theory and applied AI systems.',
        },
        {
          title: 'Downstream Systems',
          body: 'Can inform assistant design, training, and interpretation layers.',
        },
      ]}
      links={[
        {
          href: '/research/intelligence',
          label: 'Research Track',
          body: 'Return to the intelligence domain.',
        },
        {
          href: '/research',
          label: 'Archive',
          body: 'Go back to the research archive.',
        },
      ]}
    />
  );
}
