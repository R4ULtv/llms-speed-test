import { Toaster } from "sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LLMs Speed Test",
  description:
    "Benchmark Your LLMs in Seconds! Compare Model Speeds, Analyze Performance Metrics & Optimize AI Efficiency – All in One Place. Test, Export, Dominate.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-100 text-zinc-900 relative`}
      >
        {children}
        <Toaster />
        <footer className="absolute bottom-5 right-1/2 translate-x-1/2 text-zinc-700 text-sm text-center text-balance">
          Made by{" "}
          <a
            href="https://x.com/lil_poop__"
            target="_blank"
            className="text-zinc-900 font-semibold hover:underline underline-offset-2"
          >
            Raul Carini
          </a>{" "}
          · Source code on{" "}
          <a
            href="https://github.com/r4ultv/llms-speed-test"
            target="_blank"
            className="text-zinc-900 font-semibold hover:underline underline-offset-2"
          >
            GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
