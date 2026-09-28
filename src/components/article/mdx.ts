import Figure from './Figure.astro';
import Photos from './Photos.astro';
import Shot from './Shot.astro';

/** Components every MDX article gets, so authors do not import them by hand. */
export const articleComponents = { Figure, Photos, Shot };
