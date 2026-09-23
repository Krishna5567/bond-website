import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Install Bond AI — Download Autonomous Multi-Agent Desktop Terminal',
  description: 'Official download and installation portal for Bond AI Desktop. Run Claude Code, Gemini CLI, GPT-4o, and local models in real native ConPTY terminal grids.',
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} ${jetbrainsMono.variable} bg-[#0a0f0d] text-white min-h-screen antialiased selection:bg-[#00A86B]/30 selection:text-emerald-300`}>
        {children}
      </body>
    </html>
  );
}
