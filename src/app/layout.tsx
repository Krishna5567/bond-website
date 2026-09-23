import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Bond — Frontier AI Agent Desktop Terminal Workbench',
  description: 'Download Bond: The autonomous multi-agent desktop command workbench. Run Claude Code, Codex, Gemini, Grok and local models in real native terminal grids.',
  icons: {
    icon: '/assets/bond-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${jetbrainsMono.variable} bg-[#F4F7F5] text-slate-900 min-h-screen antialiased selection:bg-[#00A86B]/20 selection:text-[#004D2C]`}>
        {children}
      </body>
    </html>
  );
}
