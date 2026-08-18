import { StoreState, Thread } from '../../types';
import { StateUpdater, MessagesSlice } from '../types';

const DEFAULT_TINT = '#E6E2F8';

const blankThread = (slug: string, initial: string, tint: string): Thread => ({
  slug, initial, tint, unread: 0, messages: [],
});

export const createMessagesSlice = (state: StoreState, update: StateUpdater): MessagesSlice => ({
  threads: () => state.threads,
  thread: (slug) => state.threads.find(t => t.slug === slug),
  unread: () => state.threads.reduce((acc, t) => acc + t.unread, 0),

  markRead: (slug) => {
    update(s => ({
      ...s,
      threads: s.threads.map(t => t.slug === slug ? { ...t, unread: 0 } : t),
    }));
  },

  send: (slug, text) => {
    update(s => {
      const msg = { from: 'me' as const, text, at: 'Just now' };
      const exists = s.threads.some(t => t.slug === slug);

      if (!exists) {
        const created = blankThread(slug, slug.charAt(0).toUpperCase(), DEFAULT_TINT);
        return { ...s, threads: [...s.threads, { ...created, messages: [msg] }] };
      }
      return {
        ...s,
        threads: s.threads.map(t =>
          t.slug === slug ? { ...t, unread: 0, messages: [...t.messages, msg] } : t
        ),
      };
    });
  },

  ensureThread: (slug, initial = slug.charAt(0).toUpperCase(), tint = DEFAULT_TINT) => {
    update(s => s.threads.some(t => t.slug === slug)
      ? s
      : { ...s, threads: [...s.threads, blankThread(slug, initial, tint)] });
  },
});
