"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { ArrowRightIcon, ChatBubbleIcon, CodeIcon, ImageIcon, SpeakerLoudIcon, VideoIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"

const tools= [
  {
    label:"Conversation",
    icon: ChatBubbleIcon,
    color:"text-rose-500",
    href:"/conversation"
  },

  {
    label:"Image Generator",
    icon: ImageIcon,
    color:"text-indigo-400",
    href:"/conversation"
  },

  {
    label:"Video Generator",
    icon: VideoIcon,
    color:"text-orange-500",
    href:"/conversation"
  },

  {
    label:"Music Generator",
    icon: SpeakerLoudIcon,
    color:"text-lime-400",
    href:"/conversation"
  },

  {
    label:"Code Generator",
    icon: CodeIcon,
    color:"text-yellow-500",
    href:"/conversation"
  }
]

const DashboardPage = () => {
  const router = useRouter()
    return (
      <div>
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text4xl font-bold text-center bg-gradient-to-r from-blue-600 via-orange-500 to-violet-400 text-transparent bg-clip-text">
            Welcome to IntelliKit, a Trusted AI Platform.
          </h2>
          <p className="text-muted-foreground font-light text-sm md:text:lg text-center">
            Harness the capabilities of AI with our provided tools.
          </p>
        </div>
        <div className="px-4 md:px-20 lg:px-32 space-y-4">
          {tools.map((tool)=> (
            <Card 
            onClick={()=> router.push(tool.href)}
              key={tool.href}
              className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center gap-x-4">
                  <tool.icon className={cn("w-7 h-7", tool.color)} />
                <div className="font-semibold">
                    {tool.label}
                  </div>
              </div>
              <ArrowRightIcon className="w-5 h-5"/>
            </Card>
          ))}
        </div>
      </div>
        
      )
}

export default DashboardPage

