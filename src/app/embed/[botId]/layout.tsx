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
          overflow: hidden; /* prevent page-level scrollbars inside the embed iframe */
        }

        /* Hide native scrollbars visually but keep scrolling functional for inner scrollable areas */
        /* Firefox */
        * { scrollbar-width: none; -ms-overflow-style: none; }

        /* Webkit browsers */
        *::-webkit-scrollbar { width: 0; height: 0; }

        /* Specifically ensure inner message area remains scrollable (overflow preserved) */
        .overflow-y-auto { -webkit-overflow-scrolling: touch; }
      `}</style>
      {children}
    </div>
  );
}