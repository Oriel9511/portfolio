import { useEffect } from 'react';
import { experience } from './store';

// Anchors a scene's vanishing point to a DOM element while its slide is on screen.
export function useFocus(ref, slide) {
  useEffect(() => {
    const entry = { el: ref.current, slide };
    experience.focus = entry;
    return () => {
      if (experience.focus === entry) experience.focus = null;
    };
  }, [ref, slide]);
}
