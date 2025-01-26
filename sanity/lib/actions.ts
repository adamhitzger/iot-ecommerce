import { BillIcon, CloseIcon, LeaveIcon, PackageIcon, CheckmarkIcon} from "@sanity/icons"
import { cancelled, refunded, completed, paid, send, createPacket } from "@/actions/actions";
import { DocumentActionProps } from "sanity";
import { createInvoice } from "@/actions/actions";
import { client } from "./client";
import { OrderedItem } from "@/types";

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
        if (!documentData || !documentData.email) {
            alert('Žádná data nejsou k dispozici');
            onComplete();
            return;
          }
        try{
            const response = await completed(String(documentData.email), documentData);
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
        if (!documentData || !documentData.email) {
            alert('Žádná data nejsou k dispozici');
            onComplete();
            return;
          }
          
          const name = String(documentData.name)
          const surname = String(documentData.surname)
          const email = String(documentData.email)
          const phone = String(documentData.phone)
          const packetaId = Number(documentData.packetaId)
          const total = Number(documentData.total)
          const cod = String(documentData.cod)
          const value = Number(documentData.couponValue)
          try{
          const orderedItems: OrderedItem[] = Array.isArray(documentData.orderedProducts)
        ? documentData.orderedProducts as OrderedItem[]
        : [];
          console.log(orderedItems[0])
            //send e-mail to customer that order is paid
            const emailResponse = await paid(documentData);
            if(!emailResponse.ok) throw new Error("Nepodařilo se poslat mail - paid()");
            else alert("Email byl zaslán");
            //const iDokladResponse = await createInvoice(total, name, surname, value, orderedItems)
            //if (!iDokladResponse) throw new Error("Nepodařilo se vytvořit fakturu - createInvoice()");
            //console.log(iDokladResponse)
            if(cod === "false"){
            //create Packeta label
            const packetaCode = await createPacket({name, surname,email, phone, packetaId, total})
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
        if (!documentData || !documentData.email) {
            alert('Žádná data nejsou k dispozici');
            onComplete();
            return;
          }
        try{
            const response = await send(String(documentData.email), documentData);
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
