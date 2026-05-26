import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'HMS Interview',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white px-6 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <span className="font-semibold text-sm text-gray-800">HMS Admin</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/appointments" className="text-gray-600 hover:text-gray-900">Appointments</Link>
            <Link href="/booking" className="text-gray-600 hover:text-gray-900">Book Appointment</Link>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
