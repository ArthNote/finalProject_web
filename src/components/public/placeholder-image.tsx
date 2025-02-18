export function PlaceholderIllustration() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1080 720"
      fill="none"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="1080" height="720" fill="currentColor" fillOpacity={0.05} />
      <circle cx="540" cy="360" r="200" fill="currentColor" fillOpacity={0.1} />
      <path
        d="M440 360a100 100 0 1 1 200 0 100 100 0 1 1-200 0Z"
        stroke="currentColor"
        strokeOpacity={0.2}
        strokeWidth={16}
      />
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        fill="currentColor"
        fontSize="24"
        fontWeight="500"
        opacity={0.5}
      >
        Company Brand
      </text>
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        fill="currentColor"
        fontSize="16"
        opacity={0.3}
      >
        Login illustration
      </text>
    </svg>
  );
}
