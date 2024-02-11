import Heading from "@/components/heading";

import { ChatBubbleIcon } from "@radix-ui/react-icons";

const ConversationPage = () => {
    return ( 
        <div>
            <Heading 
                title="Conversation"
                description="Meet our Chat Buddy - your friendly conversation AI."
                icon={ChatBubbleIcon}
                iconColor="text-rose-500"
            />
        </div>
    );
}
 
export default ConversationPage;