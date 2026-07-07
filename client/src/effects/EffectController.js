import { AtmosphereEffect } from './AtmosphereEffect';
import { BloomEffect } from './BloomEffect';

let snapshot = {
  bloom: BloomEffect.initialState,
  atmosphere: AtmosphereEffect.initialState,
  season: 'spring',
};

const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener(snapshot));
}

export const EffectController = {
  dispatch(event) {
    if (!event?.type) return snapshot;

    if (event.type === 'season:preset') {
      const season = event.payload?.season || snapshot.season;
      snapshot = {
        ...snapshot,
        season,
        atmosphere: AtmosphereEffect.fromSeason(season),
        bloom: {
          ...snapshot.bloom,
          palette: BloomEffect.trigger({ region: snapshot.bloom.region, season }).palette,
        },
      };
      emit();
      return snapshot;
    }

    if (event.type === 'region:hover') {
      const region = event.payload?.region;
      snapshot = {
        ...snapshot,
        atmosphere: AtmosphereEffect.withRegionProfile(snapshot.season, region?.atmosphereProfile),
        bloom: BloomEffect.trigger({
          region,
          season: snapshot.season,
        }),
      };
      emit();
      return snapshot;
    }

    if (event.type === 'region:hover:end') {
      snapshot = {
        ...snapshot,
        atmosphere: AtmosphereEffect.fromSeason(snapshot.season),
        bloom: BloomEffect.clear(snapshot.bloom),
      };
      emit();
      return snapshot;
    }

    return snapshot;
  },

  getSnapshot() {
    return snapshot;
  },

  subscribe(listener) {
    listeners.add(listener);
    listener(snapshot);
    return () => listeners.delete(listener);
  },
};
