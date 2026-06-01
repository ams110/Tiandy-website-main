export default function Logo({
  variant = 'color',
}: {
  variant?: 'color' | 'white'
  className?: string
}) {
  const mainColor = variant === 'white' ? '#ffffff' : '#1a2e4a'

  return (
    <span className="inline-flex flex-col leading-none select-none">
      <span
        style={{
          fontFamily: 'Heebo, Arial, sans-serif',
          fontWeight: 900,
          fontSize: '1.5rem',
          letterSpacing: '-0.03em',
          color: mainColor,
          lineHeight: 1,
        }}
      >
        Tiandy
      </span>
      <span
        style={{
          fontFamily: 'Heebo, Arial, sans-serif',
          fontWeight: 700,
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          color: '#42d229',
          lineHeight: 1.3,
        }}
      >
        ישראל
      </span>
    </span>
  )
}
