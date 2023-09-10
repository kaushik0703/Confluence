"use client"

import { useForm } from "react-hook-form";
import * as z from "zod" //for type onsubmit
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod";
import { userValidation } from "@/lib/validations/user";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

interface Props {
    user: {
      id: string;
      objectId: string;
      username: string;
      name: string;
      bio: string;
      image: string;
    };
    btnTitle: string;
  }

const AccountProfile = ({ user, btnTitle }: Props) => {
  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(userValidation),
        defaultValues: {
          profile_photo: user?.image || "",
          name: user?.name ||"",
          username: user?.username || "",
          bio: user?.bio || ""
        }
      });

      const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => { //get value as a string which does'nt return anything
        e.preventDefault(); //to prevent reloading

        const fileReader = new FileReader(); //to read the file

        if(e.target.files && e.target.files.length>0) { //as we are working with array of files hence length>0
          const file = e.target.files[0]; //get the file
          fileReader.readAsDataURL(file); //read the file

          if(!file.type.includes("image")) return; //if the file is not an image return

          fileReader.onloadend = () => {
            fieldChange(fileReader.result as string); //set the value of the field
            setFiles((prev) => [...prev, file]); //set the file
          }
        }
      }

      const onSubmit = async (values: z.infer<typeof userValidation>) => {
        const blob = values.profile_photo; //as the field change name is profile_photo

        const hasImageChanged = isBase64Image(blob) //check if the user changed the image

        if(hasImageChanged) {
          const imgRes = await startUpload(files)

          if(imgRes && imgRes[0].url) {
            values.profile_photo = imgRes[0].url;
          }
        }

        await updateUser({
          userId: user.id,
          username: values.username,
          name: values.name,
          bio: values.bio,
          image: values.profile_photo,
          path: pathname
        });

        if(pathname === "/account/edit") {
          router.back();
        } else {
          router.push("/")
        }
      }

  return (
    <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)} 
      className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                    <Image
                        src={field.value}
                        alt="Profile Picture"
                        width={96}
                        height={96}
                        priority
                        className="rounded-full object-contain"
                    />
                ) : (
                    <Image 
                        src="/assets/profile.svg"
                        alt="profile photo"
                        width={24}
                        height={24}
                        className="object-contain" 
                    />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input 
                    type="file"
                    accept="image/*" //image of al types
                    placeholder="upload a photo"
                    className="account-form_image-input"
                    onChange={(e) => handleImage(e, field.onChange)}
                    />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                    />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                    type="text"
                    className="account-form_input no-focus"
                    {...field}
                    />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                    rows={3}
                    className="account-form_input no-focus"
                    {...field}
                    />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">Submit</Button>
      </form>
    </Form>
  )
}

export default AccountProfile