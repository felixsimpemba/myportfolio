import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/lib/LoadingContext";
import { LoadingWrapper } from "@/components/LoadingWrapper";
import { ThemeProvider as NextThemeProvider } from "@/components/ThemeProvider";
import { ThemeProvider as CustomThemeProvider } from "@/lib/ThemeContext";
import { AuthProvider } from "@/lib/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyPortfolio - Build Your Perfect Portfolio",
  description: "Create a stunning, professional portfolio in minutes. Showcase your skills, projects, and experience with our easy-to-use platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomThemeProvider>
            <AuthProvider>
              <LoadingProvider>
                <LoadingWrapper>
                  {children}
                </LoadingWrapper>
              </LoadingProvider>
            </AuthProvider>
          </CustomThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
