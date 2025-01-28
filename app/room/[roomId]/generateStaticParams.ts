export function generateStaticParams() {
  // Pre-render some common room IDs
  return [
    { roomId: 'lobby' },
    { roomId: 'general' },
    { roomId: 'help' }
  ];
}