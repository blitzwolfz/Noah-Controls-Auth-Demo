type MarkProps = { size?: number; className?: string };

export function KeycloakMark({ size = 56, className }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className={className} fill="none">
      <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="2" />
      <circle cx="28" cy="28" r="14" fill="currentColor" />
      <rect x="27" y="28" width="22" height="3" fill="currentColor" />
      <rect x="46" y="28" width="3" height="8" fill="currentColor" />
    </svg>
  );
}

export function SuperTokensMark({ size = 56, className }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className={className} fill="none">
      <rect x="1" y="1" width="32" height="32" stroke="currentColor" strokeWidth="2" />
      <rect x="22" y="22" width="33" height="33" fill="currentColor" />
    </svg>
  );
}

export function BetterAuthMark({ size = 56, className }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className={className} fill="none">
      <rect x="1" y="1" width="54" height="54" stroke="currentColor" strokeWidth="2" />
      <path d="M28 8 L52 50 L4 50 Z" fill="currentColor" />
    </svg>
  );
}

export function ProviderMark({ id, size }: { id: 'keycloak' | 'supertokens' | 'better-auth'; size?: number }) {
  if (id === 'keycloak') return <KeycloakMark size={size} />;
  if (id === 'supertokens') return <SuperTokensMark size={size} />;
  return <BetterAuthMark size={size} />;
}
