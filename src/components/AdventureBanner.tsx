/** Shared journal cover; keep the supplied panoramic artwork whole. */
export function AdventureBanner() {
  return <div className="adventure-banner">
    <img src="/assets/global/banner.png" alt="" width="2172" height="724" fetchPriority="high" />
    <h2 className="adventure-banner-title">Little elsewhere</h2>
  </div>;
}
