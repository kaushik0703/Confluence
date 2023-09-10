import ThreadCard from "@/components/cards/ThreadCard"
import Comment from "@/components/forms/Comment";
import { fetchThreadsById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async ({ params }: {params: {id: string}}) => {
    if(!params.id) return null;

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    const thread = await fetchThreadsById(params.id);

  return (
    <section className="relative">
        <div>
        <ThreadCard 
            key={thread._id}
            id={thread._id}
            currentUserId={user?.id || ''}
            parentId={thread.parentId}
            content={thread.text}
            author={thread.author}
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
        />
        </div>

        <div className="mt-7">
          <Comment 
            threadId={thread.id}
            currentUserImg={userInfo?.image}
            currentUserId={(userInfo?._id.toString())} //as _id is an mongoDB object
          />
        </div>

        <div className="mt-10">
          {thread.children.map((childItem: any)=> (
            <ThreadCard 
              key={childItem._id}
              id={childItem._id}
              currentUserId={user?.id || ''}
              parentId={childItem.parentId}
              content={childItem.text}
              author={childItem.author}
              community={childItem.community}
              createdAt={childItem.createdAt}
              comments={childItem.children}
              isComment //set to true to indicate that we can modify the comment card
            />
          ))}
        </div>
    </section>
  )
}

export default page