"use client"

import axios from "axios";
import Heading from "@/components/dashboard/heading";
import { formSchema } from "./constants";
import * as z from "zod"
import {CodeIcon, UploadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form,FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import EmptyCode from "@/components/dashboard/empty-code";
import Loader from "@/components/dashboard/loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/dashboard/user-avatar";
import BotAvatar from "@/components/dashboard/bot-avatar";
import ReactMarkdown from "react-markdown"
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const CodePage = () => {
    const router = useRouter()
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([])
    const proModal = useProModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt:""
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage:ChatCompletionMessageParam={
                role: "user",
                content:values.prompt,
            };
            const newMessages = [...messages, userMessage];


            const response = await axios.post("/api/code", {messages:newMessages})
            setMessages((current)=> [...current, userMessage, response.data]);

            form.reset();

        } catch (error:any) {
            if(error?.response?.status === 403){
                proModal.onOpen();
            }else{
                toast.error('Something went wrong');
            }
        }finally {
            router.refresh();
        }
    }

    

    return ( 
        <div>
            <Heading 
                title="Code"
                description="Debug and create code using generative text."
                icon={CodeIcon}
                iconColor="text-yellow-500"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="
                                rounded-lg
                                border
                                w-full
                                p-4
                                px-3
                                md:px-6
                                focus-within:shadow-sm
                                grid
                                grid-cols-12
                                gap-2
                            "
                        >
                             <FormField 
                                 name="prompt"
                                 render={({ field }) => (
                                     <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input 
                                                className="border-0
                                                outline-none
                                                focus-visible:ring-0
                                                focus-visible:ring-transparent
                                                "
                                                disabled={isLoading}
                                                placeholder="Create a simple interactive button using vanilla JavaScript"
                                                {...field}
                                            />
                                        </FormControl>
                                     </FormItem>
                                 )}
                             />
                             <Button className="col-span-12 lg:col-span-2 bg-gradient-to-r from-violet-400 via-red-400 to-rose-500 w-full" disabled={isLoading}>
                                <UploadIcon className="w-5 h-5"/>
                             </Button>
                        </form> 
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center">
                            <Loader />
                        </div>
                    )}

                   <div className="flex flex-col-reverse gap-y-4">
                    {messages.length === 0 && !isLoading &&(
                        <EmptyCode label="Ask for debugging help..."/>
                    )}
                    {messages.map((message)=> (
                        <div 
                            key={message.content as string}
                            className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg",
                            message.role === 'user' ? "bg:white border border-black/10":'bg-muted'
                            )}
                        >
                            {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                            <ReactMarkdown
                                components={{
                                    pre: ({node, ...props}) => (
                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                            <pre {...props}/>
                                        </div>
                                    ),
                                    code: ({node, ...props}) => (
                                        <code className="bg-black/10 p-2 rounded-lg" {...props}/>
                                    )
                                }}
                                className="text-sm overflow-hidden leading-7"
                            >
                                {message.content as string || ""}
                            </ReactMarkdown>
                        </div>
                    ))}
                   </div>
                </div>
            </div>
        </div>
    );
}
 
export default CodePage;