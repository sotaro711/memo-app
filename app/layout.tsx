import './globals.css'
import { ToastProvider } from '@/components/Toast'
import ToastGlobalEvents from '@/components/ToastGlobalEvents'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div id="toast-root" />
        <ToastProvider />
        <ToastGlobalEvents />
        {children}
      </body>
    </html>
  );
}
