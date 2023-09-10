import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { dark } from "@clerk/themes"

function Topbar () {
  return (
    <nav className="topbar">
        <Link href="/" className="flex items-center gap-4">
            <Image src="/assets/logo.svg" alt="Logo" width={28} height={28} />
            <p className="text-heading3-bold text-light-1 max-xs:hidden">Confluence</p>
        </Link>

        <div className="flex items-center gap-1">
            <div className="block md:hidden">
                <SignedIn> {/* This reduces work of checking if user is logged in or not */}
                    <SignOutButton>
                        <div className="flex cursor-pointer">
                            <Image 
                                src={"/assets/logout.svg"} 
                                alt={"l"}
                                width={24}
                                height={24}
                            />
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
            <OrganizationSwitcher
                appearance={{
                    baseTheme: dark, //we are using dark theme
                    elements: {
                        organizationSwitcherTrigger:
                        "py-2 px-4"
                    }
                }}
            />
        </div>
    </nav>
  )
}

export default Topbar