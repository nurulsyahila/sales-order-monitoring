import type { Metadata } from "next";                                 // type for the page title and description
import { Lexend } from "next/font/google";                            // tool that loads the Lexend font from Google Fonts
import "./globals.css";                                               // load our global styles (colors, font, Tailwind)

const lexend = Lexend({                                               // set up the Lexend font and keep it in a variable
  subsets: ["latin"],                                                 // only load the Latin letters (smaller download)
  variable: "--font-lexend",                                          // CSS variable name, used in globals.css
});                                                                   // end of the font setup

export const metadata: Metadata = {                                   // page info for the browser tab and search engines
  title: "Sales Order Monitoring",                                    // text shown in the browser tab
  description: "Monitor sales orders across branches",                // short description of the page
};                                                                    // end of metadata

export default function RootLayout({                                  // the layout that wraps every page in the app
  children,                                                           // the page content that goes inside this layout
}: Readonly<{ children: React.ReactNode }>) {                         // TypeScript: children can be any React content, and it is read-only
  return (                                                            // send back the HTML structure of the page
      <html lang="en" className={lexend.variable}                     /* main HTML tag: English page, and the font variable lets the whole page use Lexend */ >
      <body className="min-h-screen antialiased"                      /* body: at least full screen height, smooth text, and the page goes inside {children} */ >{children}</body>
    </html>                                                           // end of the HTML tag
  );                                                                  // end of the return
}                                                                     // end of the RootLayout function