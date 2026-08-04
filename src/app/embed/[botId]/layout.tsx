export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-screen bg-transparent">
      <style>{`
        html,
        body,
        #__next {
          width: 100%;
          height: 100%;
          margin: 0;
          background: transparent !important;
        }
      `}</style>
      {children}
    </div>
  );
}