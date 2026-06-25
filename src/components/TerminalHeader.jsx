export default function TerminalHeader({ title, subtitle, status, onMenuOpen }) {
  return (
    <div className="border-b border-terminal-border px-3 py-2 flex items-center gap-2 shrink-0 bg-terminal-surface">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuOpen}
        className="md:hidden flex flex-col gap-1 p-1 mr-1 shrink-0"
        aria-label="Open menu"
      >
        <span className="block w-4 h-px bg-terminal-cyan" />
        <span className="block w-4 h-px bg-terminal-cyan" />
        <span className="block w-4 h-px bg-terminal-cyan" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <span className="text-terminal-cyan-bright font-mono text-xs tracking-widest uppercase truncate block">
          {title}
        </span>
        {subtitle && (
          <span className="text-terminal-text-dim text-xs hidden sm:inline">// {subtitle}</span>
        )}
      </div>

      {/* Status */}
      {status && (
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full inline-block ${
            status === 'LIVE'
              ? 'bg-terminal-cyan-bright blink'
              : 'bg-terminal-amber'
          }`} />
          <span className={`text-xs uppercase tracking-wider hidden sm:inline ${
            status === 'LIVE' ? 'text-terminal-cyan-text' : 'text-terminal-amber'
          }`}>
            {status}
          </span>
        </div>
      )}
    </div>
  )
}
