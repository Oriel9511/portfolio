import { biomatchScene } from './biomatchScene';
import { bookingScene } from './bookingScene';
import { copilotScene } from './copilotScene';
import { docScene } from './docScene';
import { eemeshScene } from './eemeshScene';
import { kinetScene } from './kinetScene';
import { limsScene } from './limsScene';
import { meliScene } from './meliScene';
import { peopleScene } from './peopleScene';
import { processScene } from './processScene';

export const WORLDS = {
  copilot: copilotScene,
  meli: meliScene,
  biomatch: biomatchScene,
  people: peopleScene,
  eemesh: eemeshScene,
  lims: limsScene,
  process: processScene,
  doc: docScene,
  kinet: kinetScene,
  booking: bookingScene,
};
