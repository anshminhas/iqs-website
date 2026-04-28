
import '../src/index.css';

export const metadata = {
  title: 'IQS - Integrated Quality Solutions | HR & Recruitment',
  description: 'HR and business services firm that specializes in streamlining payroll, workforce management and operational compliance.',
};

import ClientLayout from '../src/components/layout/Layout';
import { ThemeProvider } from '../src/components/theme-provider';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
