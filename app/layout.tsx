import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "./components/store";

export const metadata: Metadata = {
    title: "Student Result Dashboard",
    description: "Student assignments and results"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>)
{
    return (
        <html lang="en">
            <body>
                <DataProvider>{children}</DataProvider>
            </body>
        </html>
    );
}
