import RoutePage from '@/components/RoutePage';

export default function AnnouncementsPage() {
  return (
    <RoutePage
      eyebrow="Media / Announcements"
      title="Announcements"
      description="Announcements centralize the site's latest updates, releases, and public notices."
      highlights={[
        {
          title: 'Release Stream',
          body: 'A formal location for site updates and product announcements.',
        },
        {
          title: 'Visibility',
          body: 'Supports a clear cadence for public communication.',
        },
        {
          title: 'Future Ready',
          body: 'Can later become a structured news feed or update log.',
        },
      ]}
      links={[
        {
          href: '/media',
          label: 'Media',
          body: 'Return to the media hub.',
        },
        {
          href: '/media/press',
          label: 'Press',
          body: 'Open the press materials page.',
        },
      ]}
    />
  );
}
