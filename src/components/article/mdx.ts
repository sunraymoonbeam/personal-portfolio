import Figure from './Figure.astro';
import Photos from './Photos.astro';
import Shot from './Shot.astro';
import Clip from './Clip.astro';
import Clips from './Clips.astro';
import StackBars from './StackBars.astro';
import PairBars from './PairBars.astro';
import Timeline from './Timeline.astro';
import Flow from './Flow.astro';
import Table from './Table.astro';

/**
 * Components every MDX article gets, so authors do not import them by hand.
 * `table` replaces the HTML element: every Markdown table goes through Table.
 */
export const articleComponents = { Figure, Photos, Shot, Clip, Clips, StackBars, PairBars, Timeline, Flow, table: Table };
