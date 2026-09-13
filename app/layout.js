import { Poppins, Playball } from "next/font/google";
import "./globals.css";
import AppShell from "../components/AppShell";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const playball = Playball({
  variable: "--font-playball",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "Hooperzclub | Organize & Join Sports Leagues",
  description: "The ultimate platform for multi-sport organizers, athletes, and fans to manage events, leagues, and teams.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playball.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
