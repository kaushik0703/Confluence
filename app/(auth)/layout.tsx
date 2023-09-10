//To specify different roles for authentication routes(applicable for only auth routes)
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"

import '../globals.css'

export const metadata = {
    title: 'Confluence',
    description: 'A Next.js 13 Confluence Application'
}

//Fonts in nextjs
//subsets needs to be an array as we can have multiple subsets in it
const inter = Inter({subsets : ["latin"]}) 

//typescript hence we have to mention type of children
export default function RootLayout({ 
    children //props
}: { 
    children: React.ReactNode //type of props
}) {
    return (
    <ClerkProvider>
        <html lang="en">
            <body className={`${inter.className} bg-dark-1`}> {/* black bg */}
                <div className="w-full flex justify-center items-center min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    </ClerkProvider>
    )
}