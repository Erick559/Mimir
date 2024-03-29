import Replicate from "replicate";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { increaseAPILimit, checkApLimit } from "@/lib/api_limits";
import { checkSubscription } from "@/lib/subscription_check";


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY!,
});

export async function POST(
    req: Request
  ) {
    try {
      const { userId } = auth();
      const body = await req.json();
      const { prompt  } = body;
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      if (!prompt) {
        return new NextResponse("Prompt is required", { status: 400 });
      }

      const freeTrial = await checkApLimit();
      const isPro = await checkSubscription();

      if(!freeTrial && !isPro){
          return new NextResponse('Free trial expired', {status:403});
      }
  
      const response = await replicate.run(
        "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
        {
          input: {
            prompt: prompt
          }
        }
      );

      if(!isPro){
        await increaseAPILimit()
      }
  
      return NextResponse.json(response);
    } catch (error) {
      console.log('[VIDEO_ERROR]', error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  };