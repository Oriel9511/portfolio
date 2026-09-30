import { agentsScene } from './agentsScene';
import { bookingScene } from './bookingScene';
import { copilotScene } from './copilotScene';
import { docScene } from './docScene';
import { eemeshScene } from './eemeshScene';
import { kinetScene } from './kinetScene';
import { limsScene } from './limsScene';
import { processScene } from './processScene';

export const WORLDS = {
  copilot: copilotScene,
  eemesh: eemeshScene,
  lims: limsScene,
  process: processScene,
  doc: docScene,
  kinet: kinetScene,
  booking: bookingScene,
  agents: agentsScene,
};
