import RoutePage from '@/components/RoutePage';

export default function PressPage() {
  return (
    <RoutePage
      eyebrow="Media / Press"
      title="Press Materials"
      description="Press is the public-facing media layer for announcements, coverage, and institutional visibility."
      highlights={[
        {
          title: 'Public Narrative',
          body: 'A place to surface the most current institutional story and media assets.',
        },
        {
          title: 'Discovery',
          body: 'Useful for journalists, partners, and external observers.',
        },
        {
          title: 'Content Hub',
          body: 'Can later host media kits, bios, and brand assets.',
        },
      ]}
      links={[
        {
          href: '/media',
          label: 'Media',
          body: 'Return to the media hub.',
        },
        {
          href: '/media/announcements',
          label: 'Announcements',
          body: 'See the other media route.',
        },
      ]}
    />
  );
}
