export interface RssFeed {
  rss: {
    channel: RssChannel;
  };
}

export interface RssChannel {
  title: string;
  description?: string;
  link?: string;
  item: RssEpisode | RssEpisode[];
  'itunes:image'?: { href: string };
}

export interface RssEpisode {
  title: string;
  description?: string;
  pubDate: string;
  enclosure?: {
    url?: string;
    '@_url'?: string;
    type?: string;
    length?: string;
  };
  'itunes:duration'?: string;
  'itunes:episode'?: string;
  'itunes:episodeType'?: string;
  'itunes:image'?: { href: string };
  guid?: string;
}
