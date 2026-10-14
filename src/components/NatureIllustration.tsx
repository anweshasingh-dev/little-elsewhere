const assets: Record<string, string> = {
  leaf: 'grass', cloud: 'cloud', yellow: 'sun', sun: 'sun', bird: 'bird',
  flower: 'search', sound: 'music', shape: 'rock', moving: 'butterfly',
  tiny: 'mushroom', drop: 'sprout', pencil: 'paper_plane', star: 'star',
};
/** Reuse the supplied scrapbook artwork; utility controls use Icon. */
export function NatureIllustration({ name, className = '' }: { name: string; className?: string }) {
  return <img className={`nature-art ${className}`} src={`/assets/bingo_icons/${assets[name] ?? name}.png`} alt="" aria-hidden="true" />;
}
