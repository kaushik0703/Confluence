"use client"

import * as z from "zod" //for type onsubmit
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } 
from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";

import { usePathname, useRouter } from "next/navigation";

import { CommentValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({threadId, currentUserImg, currentUserId}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
        thread: ''
    }
    });

    //we get values directly from react hook form
    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(threadId, values.thread, currentUserId, pathname);

        form.reset(); //To reset the form and add the new comment
    }
  return (
    <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="comment-form"
        >
            <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className="flex gap-3 w-full items-center">
                    <FormLabel>
                        <Image
                            src={currentUserImg}
                            alt="Profile Image"
                            className="cursor-pointer rounded-full object-cover"
                            width={48}
                            height={48}
                        />
                    </FormLabel>
                    <FormControl className="border-none bg-transparent">
                        <Input
                            type="text"
                            placeholder="Comment..."
                            className="no-focus text-light-1 outline-none"
                            {...field}
                            />
                    </FormControl>
                    </FormItem>
                )}
            />
        <Button type="submit" className="comment-form_btn">
            Reply
        </Button>
        </form>
    </Form>
  )
}
export default Comment;