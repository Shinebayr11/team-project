import { StoreState } from '../../types';
import { StateUpdater, SocialSlice } from '../types';

export const createSocialSlice = (state: StoreState, update: StateUpdater): SocialSlice => ({
  isFollowing: (slug) => !!state.following[slug],
  followingCount: () => Object.keys(state.following).length,

  toggleFollow: (slug) => {
    update(s => {
      const next = { ...s.following };
      if (next[slug]) delete next[slug];
      else next[slug] = true;
      return { ...s, following: next };
    });
  },
});
