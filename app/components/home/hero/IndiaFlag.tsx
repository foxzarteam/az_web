export default function IndiaFlag() {
  return (
    <svg viewBox="0 0 24 16" className="w-6 h-4 rounded-sm overflow-hidden" aria-label="India">
      <rect width="24" height="16" fill="#FF9933" />
      <rect y="5.33" width="24" height="5.33" fill="#fff" />
      <rect y="10.67" width="24" height="5.33" fill="#138808" />
      <circle cx="12" cy="8" r="2.2" fill="#000080" />
      <g fill="#fff" stroke="#000080" strokeWidth="0.15">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="12" y1="8" x2="12" y2="5.8" transform={`rotate(${i * 30} 12 8)`} />
        ))}
      </g>
    </svg>
  );
}
