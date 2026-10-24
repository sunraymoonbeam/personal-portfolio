import Figure from './Figure.astro';
import Photos from './Photos.astro';
import Shot from './Shot.astro';
import Clip from './Clip.astro';
import Clips from './Clips.astro';
import StackBars from './StackBars.astro';
import PairBars from './PairBars.astro';

/** Components every MDX article gets, so authors do not import them by hand. */
export const articleComponents = { Figure, Photos, Shot, Clip, Clips, StackBars, PairBars };
