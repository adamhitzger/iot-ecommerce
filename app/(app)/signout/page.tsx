import { Suspense } from "react";
import SignOutFromComp from "@/components/signOutForm";

export default function SignOutFromNewsletter({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}){
return(
    <Suspense fallback={<section className="w-full min-h-screen bg-primary"></section>}>
        <SignOutFromComp searchParams={searchParams}/>
      </Suspense>
)
}
