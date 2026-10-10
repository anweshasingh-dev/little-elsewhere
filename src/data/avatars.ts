export const avatars = [
  { id: 'explorer-1', src: '/assets/avatars/explorer-1.png', label: 'Flower explorer', alt: 'Explorer with long brown hair holding a daisy on a pink background' },
  { id: 'explorer-2', src: '/assets/avatars/explorer-2.png', label: 'Butterfly explorer', alt: 'Waving explorer with braided hair and butterflies on a lavender background' },
  { id: 'explorer-3', src: '/assets/avatars/explorer-3.png', label: 'Birdwatcher explorer', alt: 'Explorer with binoculars and a yellow bird on a sky blue background' },
  { id: 'explorer-4', src: '/assets/avatars/explorer-4.png', label: 'Sunny explorer', alt: 'Waving explorer in a backwards cap on a warm yellow background' },
  { id: 'explorer-5', src: '/assets/avatars/explorer-5.png', label: 'Daisy explorer', alt: 'Explorer with short brown hair holding a daisy wreath on a sage green background' },
  { id: 'explorer-6', src: '/assets/avatars/explorer-6.png', label: 'Paper boat explorer', alt: 'Explorer in blue overalls holding a paper boat on a sky blue background' },
] as const;
export type AvatarId = typeof avatars[number]['id'];
export function isAvatarId(value: unknown): value is AvatarId {
  return avatars.some((avatar) => avatar.id === value);
}
