import RoutePage from '@/components/RoutePage';

export default function BuildPage() {
  return (
    <RoutePage
      eyebrow="Build"
      title="Build the Systems Layer"
      description="FCRI is an applied research organization. Builders turn the institute's frameworks into products, infrastructure, and deployable services."
      highlights={[
        {
          title: 'Implementation Track',
          body: 'Ship software, infrastructure, and automation that turn research into visible outcomes.',
        },
        {
          title: 'Contributor Access',
          body: 'Bring engineering, design, research, or operations expertise to active FCRI workstreams.',
        },
        {
          title: 'Deployment Discipline',
          body: 'Every build should map back to a research domain, a system, or a live ecosystem need.',
        },
      ]}
      links={[
        {
          href: '/participation',
          label: 'Participation',
          body: 'See how to join the mission across research, media, and deployment.',
        },
        {
          href: '/research',
          label: 'Research',
          body: 'Review the underlying frameworks that shape the build queue.',
        },
      ]}
      footer="This route now resolves for the public site and can be expanded with intake forms or contributor onboarding without changing the surrounding navigation."
    />
  );
}
