import { getCurrentUser } from "@/auth/currentUser";
import { getUser } from "@/auth/server"
import UserForm from "@/components/userForm"
import {  sanityFetch } from "@/sanity/lib/client";
import { USER_ORDERS } from "@/sanity/lib/queries";
import { Order } from "@/types";


export default async function UserPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }){
    const searchParams = await props.searchParams
    const changeNames =  searchParams?.names;
    
    
    const user = await getCurrentUser({withFullUser: true})
    console.log(user)
    if (!user) {
        return <div>User not found</div>
      }
    let orders: Order[] = []
  try {
    orders = await sanityFetch<Order[]>({
      query: USER_ORDERS,
      params: { email: user.email },
    })
  } catch (error) {
    console.error("Error fetching user orders:", error)
  }
    console.log(user)
    return(   
        <>
        <UserForm user={user}  changeNames={changeNames} orders={orders}/>   
       </>
    )
}

