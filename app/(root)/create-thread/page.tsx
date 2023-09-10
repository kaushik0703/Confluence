import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();

    if(!user) return null; //return null means that the page will not be rendered

    const userInfo = await fetchUser(user.id);
    
    if(!userInfo?.onboarded) redirect("/onboarding");

    return (
        <>
            <h1 className="head-text">Create Thread</h1>

            <PostThread userId={userInfo._id.toString()}/> {/* _id is the unique id of the user in mongodb */}
                {/* toString() is used to convert the id to string as it is an object */}
        </>
    )
}

export default Page;