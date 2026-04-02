import RoutePage from '@/components/RoutePage';

export default function SentientComputingPage() {
  return (
    <RoutePage
      eyebrow="Research Paper"
      title="Sentient Computing"
      description="A working paper about context-aware intelligence, adaptive interfaces, and machine systems that respond to changing environments."
      highlights={[
        {
          title: 'Core Idea',
          body: 'Static code is not enough when systems need to reason across shifting conditions.',
        },
        {
          title: 'Research Value',
          body: 'This paper helps justify the intelligence track and future product direction.',
        },
        {
          title: 'Downstream Systems',
          body: 'The ideas should influence automation, orchestration, and assistant design.',
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
