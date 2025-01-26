import Forgot from "@/components/modals/forgot";
import SignInForm from "@/components/signInForm";



export default async function SignInPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }){
    const searchParams = await props.searchParams
    const forgotPass = searchParams?.forgot;
    
      
    return(
        <>
        <SignInForm/>
        {forgotPass && <Forgot/>}
        </>
    )
}