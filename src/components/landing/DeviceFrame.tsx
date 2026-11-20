/**
 * An iPhone 16 Pro drawn to its real proportions (see `.device` in globals.css):
 * 402×874pt screen with 62pt corners, the Dynamic Island, and the bezel and
 * band around it. Everything scales with the frame's width.
 *
 * `statusBar` draws the clock and status icons for live content. Leave it off
 * around a real screenshot, which already has them.
 */
export function DeviceFrame({
  children,
  label,
  hero = false,
  statusBar = false,
  className = '',
}: {
  children: React.ReactNode
  label?: string
  /** Size the phone from the viewport height so it fits the first screen. */
  hero?: boolean
  statusBar?: boolean
  className?: string
}) {
  return (
    <div
      role={label ? 'region' : undefined}
      aria-label={label}
      className={`device-fit ${hero ? 'device-fit--hero' : ''} ${className}`}
    >
      <span aria-hidden className="device-btn device-btn--action" />
      <span aria-hidden className="device-btn device-btn--up" />
      <span aria-hidden className="device-btn device-btn--down" />
      <span aria-hidden className="device-btn device-btn--side" />
      <div className="device">
        <div className="device-bezel">
          <div className="device-screen">
            {children}
            {statusBar && (
              <div aria-hidden className="device-status">
                <span className="device-status-time">9:41</span>
                <span className="device-status-icons">
                  <svg viewBox="0 0 18 12" fill="currentColor">
                    <rect x="0" y="8" width="3" height="4" rx="0.8" />
                    <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
                    <rect x="10" y="3" width="3" height="9" rx="0.8" />
                    <rect x="15" y="0.5" width="3" height="11.5" rx="0.8" />
                  </svg>
                  <svg viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1.4 4.4a10.2 10.2 0 0114.2 0" />
                    <path d="M4.2 7.2a6.2 6.2 0 018.6 0" />
                    <circle cx="8.5" cy="10.2" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                  <svg viewBox="0 0 27 13" fill="currentColor">
                    <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity="0.4" />
                    <rect x="2" y="2" width="20" height="9" rx="2.4" />
                    <path d="M25 4.4v4.2c.9-.3 1.5-1.1 1.5-2.1s-.6-1.8-1.5-2.1z" opacity="0.45" />
                  </svg>
                </span>
              </div>
            )}
            <span aria-hidden className="device-island" />
            <span aria-hidden className="device-home" />
          </div>
        </div>
      </div>
    </div>
  )
}
