import { useEffect } from 'react';
import { experience } from './store';

// Registers an element as a quiet zone (k < 1 dims the field) or hole (k = 0) while its slide is on screen.
export function useZone(ref, { slide, k, feather = 32 }) {
  useEffect(() => {
    const entry = { el: ref.current, slide, k, feather };
    experience.zones.add(entry);
    return () => experience.zones.delete(entry);
  }, [ref, slide, k, feather]);
}
