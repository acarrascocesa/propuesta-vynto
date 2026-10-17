import type { Metadata } from 'next';
import { DemoProvider } from '@/components/demo-context';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/ibm-plex-sans/wght.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'VYNTO — Lo que necesitas, más cerca de ti',
  description: 'Descubre servicios y conecta con talento local. Prototipo de demostración con datos ficticios.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body><DemoProvider>{children}</DemoProvider></body></html>;
}
