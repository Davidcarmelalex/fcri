import RoutePage from '@/components/RoutePage';

export default function GrantsPage() {
  return (
    <RoutePage
      eyebrow="Grants"
      title="Research Grants and Fellowships"
      description="Grant programs are the mechanism for funding targeted research, applied pilots, and high-leverage collaborations."
      highlights={[
        {
          title: 'Project Funding',
          body: 'Support discrete initiatives that map to core FCRI domains and publishable outputs.',
        },
        {
          title: 'Fellowship Support',
          body: 'Enable researchers and operators to work within the institute for a defined period.',
        },
        {
          title: 'Reviewability',
          body: 'A grants layer also creates a natural place for transparent allocation and reporting.',
        },
      ]}
      links={[
        {
          href: '/academics/fellowships',
          label: 'Fellowships',
          body: 'Look at the academic-side pathway for deeper research engagement.',
        },
        {
          href: '/support',
          label: 'Support',
          body: 'Use the support layer for direct mission funding.',
        },
      ]}
    />
  );
}
