import { BillIcon, CloseIcon, LeaveIcon, PackageIcon, CheckmarkIcon, EnvelopeIcon} from "@sanity/icons"
import { cancelled, refunded, completed, paid, send, createPacket, emailCampaign, sms } from "@/actions/actions";
import { DocumentActionProps } from "sanity";
import { createInvoice } from "@/actions/actions";
import { client, sanityFetch } from "./client";
import { Campaign,Order,OrderedItem, User } from "@/types";
import { GET_CAMPAIGN, GET_USERS, ORDER_BY_ID } from "./queries";


export function cancelledOrder({draft, published, onComplete }: DocumentActionProps) {
      const handleAction = async () => {
            const documentData = draft || published;
            if (!documentData || !documentData.email) {
                alert('Žádná data nejsou k dispozici');
                onComplete();
                return;
              }
            try{
                const response = await cancelled(String(documentData.email));
                if(!response.ok) throw new Error("Nepodařilo se poslat mail - cancelled()");
                else 
                  alert("Email byl zaslán")
                  await client.patch(documentData._id).set({status: "Zrušená"}).commit();
            }catch(error) {
                console.log("Error v akci cancelled(): ", error)
            }finally{
                onComplete();
            }      
      }

      return{
        label: "Objednávka zrušena",
        onHandle: handleAction,
        icon: CloseIcon
      }
} 

export function refundedOrder({draft, published, onComplete }: DocumentActionProps) {
  const handleAction = async () => {
        const documentData = draft || published;
        if (!documentData || !documentData.email) {
            alert('Žádná data nejsou k dispozici');
            onComplete();
            return;
          }
        try{
            const response = await refunded(String(documentData.email));
            if(!response.ok) throw new Error("Nepodařilo se poslat mail - refunded()");
            else 
              alert("Email byl zaslán")
              await client.patch(documentData._id).set({status: "Vrácení"}).commit();
        }catch(error) {
            console.log("Error v akci refunded(): ", error)
        }finally{
            onComplete();
        }    
 
  }

  return{
    label: "Objednávka vrácena",
    onHandle: handleAction,
    icon: LeaveIcon
  }
} 

export function completedOrder({draft, published, onComplete }: DocumentActionProps) {
  const handleAction = async () => {
        const documentData = draft || published;
        if (!documentData) {
            alert('Žádná data nejsou k dispozici');
            onComplete();
            return;
          }
        try{
             const get_order = await sanityFetch<Order[]>(
            {
              query: ORDER_BY_ID,
              params: {id: documentData._id}
            }
          )
            const response = await completed(String(get_order[0].user.email), get_order[0]);
            if(!response.ok) throw new Error("Nepodařilo se poslat mail - completed()");
            else 
              alert("Email byl zaslán")
              await client.patch(documentData._id).set({status: "Vyzvednutá"}).commit();
        }catch(error) {
            console.log("Error v akci completed(): ", error)
        }finally{
            onComplete();
        }      
  }

  return{
    label: "Objednávka vyzvednuta",
    onHandle: handleAction,
    icon: CheckmarkIcon
  }
} 

export function paidOrder({draft, published, onComplete }: DocumentActionProps) {
  const handleAction = async () => {
    let data: OrderedItem[];
        const documentData = draft || published;
        if (!documentData) {
          console.log(documentData)
            alert('Žádná data nejsou k dispozici');
            onComplete();
            return;
          }
          
          const packetaId = Number(documentData.packetaId)
          const total = Number(documentData.total)
          const cod = String(documentData.cod)
          const value = Number(documentData.couponValue)
          try{
          const orderedItems: OrderedItem[] = Array.isArray(documentData.orderedProducts)
          ? documentData.orderedProducts as OrderedItem[]
          : [];
          const get_order = await sanityFetch<Order[]>(
            {
              query: ORDER_BY_ID,
              params: {id: documentData._id}
            }
          )
          console.log(get_order[0])
          const {name, surname, email, tel} = get_order[0].user
            //send e-mail to customer that order is paid
            const emailResponse = await paid(get_order[0], documentData._id);
            if(!emailResponse.ok) throw new Error("Nepodařilo se poslat mail - paid()");
            else alert("Email byl zaslán");
            const iDokladResponse = await createInvoice(total, String(get_order[0].user.name), String(get_order[0].user.surname), value, orderedItems)
            if (!iDokladResponse) throw new Error("Nepodařilo se vytvořit fakturu - createInvoice()");
            console.log(iDokladResponse)
            if(cod === "false"){
            //create Packeta label
            const packetaCode = await createPacket({name:String(name), surname: String(surname),email, phone:String(tel), packetaId, total})
            if(!packetaCode) throw new Error("Nepodařilo se poslat mail - paid()");
            else 
              alert("Štítek byl vytvořen");
              await client.patch(documentData._id).set({barcode: packetaCode, status: "Zaplacená"}).commit()
            } 
          }catch(error) {
            console.log("Error v akce paid(): ", error)
        }finally{
            onComplete();
        }      
  }

  return{
    label: "Objednávka zaplacena",
    onHandle: handleAction,
    icon: BillIcon
  }
} 

export function sendOrder({draft, published, onComplete }: DocumentActionProps) {
  const handleAction = async () => {
        const documentData = draft || published;
        if (!documentData) {
            alert('Žádná data nejsou k dispozici');
            onComplete();
            return;
          }
        try{
           const get_order = await sanityFetch<Order[]>(
            {
              query: ORDER_BY_ID,
              params: {id: documentData._id}
            }
          )
          console.log(get_order[0])
            const response = await send(String(get_order[0].user.email), get_order[0]);
            if(!response.ok) throw new Error("Nepodařilo se poslat mail - send()");
            else 
              alert("Email byl zaslán")
              await client.patch(documentData._id).set({status: "Odeslaná"}).commit();
        }catch(error) {
            console.log("Error v akci send()", error)
        }finally{
            onComplete();
        }      
  }

  return{
    label: "Objednávka poslána",
    onHandle: handleAction,
    icon: PackageIcon
  }
} 

export function sendCampaign({draft, published, onComplete}: DocumentActionProps){
  const handleAction = async () => {
     const documentData = draft || published;
     let date = 60*60*24
     let okMails = 0;
     let cleanedUsers:string[]= [];
     if (!documentData) {
            alert('Žádná data nejsou k dispozici');
            onComplete();
            return;
      }
      try{
        console.log(documentData)
        const campaigns = await sanityFetch<Campaign>({
          query: GET_CAMPAIGN,
          params: {id: documentData._id}
        })
        console.log("Data",campaigns)
        switch(campaigns.targetEra){
          case "month": 
            date*=30;
            break;
          case "quarter": 
            date*=90;
            break;
          case "half-yearly": 
            date*=120;
            break;
          case "year": 
            date*=365;
            break;
          case "overYear": 
            date*=2000;
            break;  
        }

        const users_by_order = await sanityFetch<Array<{user:User}>>({
          query: GET_USERS,
          params: {
            type: campaigns.targetSegment, 
            date: date,
          }
        })
        console.log(campaigns.targetSegmentType)
         console.log(users_by_order)
        const emailCounts = new Map<string, number>();
        for(let i=0;i<users_by_order.length;i++){ 
          console.log(users_by_order[i].user.email)
          const cleanEmail = (users_by_order[i].user.email || "").trim().toLowerCase();
          emailCounts.set(cleanEmail, (emailCounts.get(cleanEmail) || 0) + 1);
        }
        console.log(emailCounts)
      switch (campaigns.targetSegmentType) {
  case "more": // více než jednou
    cleanedUsers = Array.from(
      new Set(
        users_by_order
          .filter(u => emailCounts.get((u.user.email || "").trim().toLowerCase())! > 1)
          .map(u => (u.user.email || "").trim().toLowerCase())
      )
    );
    break;
  case "one": // jen jednou
    cleanedUsers = Array.from(
      new Set(
        users_by_order
          .filter(u => emailCounts.get((u.user.email || "").trim().toLowerCase())! === 1)
          .map(u => (u.user.email || "").trim().toLowerCase())
      )
    );
    break;
}
       console.log(cleanedUsers)
        for(let i=0;i<cleanedUsers.length;i++){
         const sendMails = await emailCampaign(cleanedUsers[i], campaigns, campaigns.emailProducts)
         if(sendMails.ok) okMails++;
        };
        alert(`E-mail byl úspěšně odeslán ${okMails} z ${cleanedUsers.length} uživatelům`)
      }catch(error){
        console.log("Error v akci campaign()", error)
      }finally{
        onComplete()
      }
  }

  return{
    label: "Odeslat e-mail kampaň",
    onHandle: handleAction,
    icon: EnvelopeIcon
  }
}
//upravit
export function sendSMS({draft, published, onComplete}: DocumentActionProps){
  const handleAction = async () => {
     const documentData = draft || published;
     let date = 60*60*24
     let successfullySent = 0;
     let cleanedUsers:string[]= [];
     
     if (!documentData) {
            alert('Žádná data nejsou k dispozici');
            onComplete();
            return;
      }
      try{
        console.log(documentData)
        const campaigns = await sanityFetch<Campaign>({
          query: GET_CAMPAIGN,
          params: {id: documentData._id}
        })
        console.log("Data",campaigns)
        switch(campaigns.targetEra){
          case "month": 
            date*=30;
            break;
          case "quarter": 
            date*=90;
            break;
          case "half-yearly": 
            date*=120;
            break;
          case "year": 
            date*=365;
            break;
          case "overYear": 
            date*=2000;
            break;  
        }

        const users_by_order = await sanityFetch<Array<{user:User}>>({
          query: GET_USERS,
          params: {
            type: campaigns.targetSegment, 
            date: date,
          }
        })
        console.log(campaigns.targetSegmentType)
         console.log(users_by_order)
        const smsCounts = new Map<string, number>();
        for(let i=0;i<users_by_order.length;i++){ 
          console.log(users_by_order[i].user.tel)
          const cleanSMS = (users_by_order[i].user.tel || "").trim().toLowerCase();
          smsCounts.set(cleanSMS, (smsCounts.get(cleanSMS) || 0) + 1);
        }
        console.log(smsCounts)
      switch (campaigns.targetSegmentType) {
  case "more": // více než jednou
    cleanedUsers = Array.from(
      new Set(
        users_by_order
          .filter(u =>smsCounts.get((u.user.tel || "").trim().toLowerCase())! > 1)
          .map(u => (u.user.tel || "").trim().toLowerCase())
      )
    );
    break;
  case "one": // jen jednou
    cleanedUsers = Array.from(
      new Set(
        users_by_order
          .filter(u =>smsCounts.get((u.user.tel || "").trim().toLowerCase())! === 1)
          .map(u => (u.user.tel || "").trim().toLowerCase())
      )
    );
    break;
}
       console.log(cleanedUsers)
        for(let i=0;i<cleanedUsers.length;i++){
         const res =  await sms(cleanedUsers[i], campaigns.smsText,campaigns.campaignCode.code)
          if(res) successfullySent++;
        };
        
      }catch(error){
        console.log("Error v akci campaign()", error)
      }finally{
        alert(`SMS byla úspěšně poslána ${successfullySent} z ${cleanedUsers.length}`);
        onComplete()
      }
  }

  return{
    label: "Odeslat SMS kampaň",
    onHandle: handleAction,
    icon: EnvelopeIcon
  }
}