import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if(!user) return null; //if user is not logged in, return null

  const userInfo = await fetchUser(user?.id);
  if(userInfo?.onboarded) redirect('/');

  const userData = {
    id: user?.id,
    objectId: JSON.stringify(userInfo?._id),
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl
  }

  return (
    <main className="mx-auto flex max-w-3xl max-h-screen flex-col justify-start px-10 py-8">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-1">
                Complete your profile to get started with Confluence.
            </p>

            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile
                  user={userData}
                  btnTitle="Continue"
                />
            </section>
        </main>
  )
}

export default Page