# Touch the Grass ? local assets

The UI uses bundled Nunito (`public/fonts/Nunito-Variable.ttf`, SIL OFL; retain its notice) and the supplied PNG illustrations. No image or font requests go to third-party hosts.

| Folder | Use |
| --- | --- |
| `public/assets/global/coin.png` | Coin balance, quest rewards, reward guidance |
| `public/assets/global/bagpack.png` | Home backpack invitation and collection page; original spelling preserved |
| `public/assets/home_icons/` | `bingo_icon.png`, `quest_icon.png`, `trinkets.png` adventure artwork |
| `public/assets/avatars/` | Six existing explorer portraits |
| `public/assets/bingo_icons/` | 23 original activity/sticker assets, with filenames preserved |

Activity mapping: grass ? leaves; cloud ? clouds; sun ? yellow; bird ? bird; search (flower magnifier) ? flowers; music ? sounds; rock ? shapes; butterfly ? movement; mushroom ? tiny details. Plant care uses sprout; drawing uses paper_plane. Quest trails use search, paper_plane, and star for Choose, Explore, Collect. Mood choices use sun, star, cloud, moon, and daydream.

Other available assets: cat, dog, caterpiller, worm, squirrel, stick, nut, pinecorn, paper_boat. Asset ownership/license was not supplied; preserve these source files and confirm distribution rights before public release.

Lucide React utility controls retain `public/licenses/Lucide-LICENSE.txt`. The retired pixel font is not loaded or used; all pages use bundled Nunito. Existing screenshots predate the current polish.

Bingo reset uses the supplied `public/assets/global/Refresh_Arrow.png` directly.

UI polish: the panoramic banner is preserved whole and headed Little elsewhere. Mood buttons now use the documented sun/star/cloud/moon/daydream mapping. Quest trail markers reflect the existing available/active/completed/claimed lifecycle, not subtask counts. User-created Bingo ink remains an interactive drawing surface, never a substitute for the PNG artwork.

Targeted restoration: the original avatar edge clip-path and silhouette shadow, raised mood cards, warm Home paper colors, layered adventure-card shadows, and dashed backpack keepsakes are restored. The full banner matches the page content width (1000px maximum on Bingo), with its title directly on the illustration. Original PNG files and state logic are unchanged.

The landscape illustration at assets/global/footer.png is shared by every route through SiteFooter, outside the constrained content shell. It fills the viewport width with no side or bottom gaps, scales proportionally, and crops on narrow screens to retain a minimum height of 160px.
