export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div
        className="aurora-orb -left-[25vw] -top-[14vh] size-[90vmax] max-h-[900px] max-w-[900px]"
        style={{ '--orb-color': 'var(--orb-1)' } as React.CSSProperties}
      />
      <div
        className="aurora-orb -right-[30vw] top-[20vh] size-[95vmax] max-h-[960px] max-w-[960px]"
        style={
          { '--orb-color': 'var(--orb-2)', animationDelay: '-9s', animationDuration: '34s' } as React.CSSProperties
        }
      />
      <div
        className="aurora-orb bottom-[-24vh] left-[10vw] hidden size-[70vmax] max-h-[740px] max-w-[740px] md:block"
        style={
          { '--orb-color': 'var(--orb-3)', animationDelay: '-17s', animationDuration: '40s' } as React.CSSProperties
        }
      />
    </div>
  )
}
