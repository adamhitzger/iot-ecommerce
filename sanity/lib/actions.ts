import { BillIcon, CloseIcon, LeaveIcon, PackageIcon, CheckmarkIcon} from "@sanity/icons"
import { cancelled, refunded, completed, paid, send } from "@/actions/actions";
import { DocumentActionProps } from "sanity";

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
                else alert("Email byl zaslán");
            }catch(error) {
                console.log("Nepodařilo se poslat mail: ", error)
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
            else alert("Email byl zaslán");
        }catch(error) {
            console.log("Nepodařilo se poslat mail: ", error)
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
            const response = await completed(String(documentData.email));
            if(!response.ok) throw new Error("Nepodařilo se poslat mail - completed()");
            else alert("Email byl zaslán");
        }catch(error) {
            console.log("Nepodařilo se poslat mail: ", error)
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
        const documentData = draft || published;
        if (!documentData || !documentData.email) {
            alert('Žádná data nejsou k dispozici');
            onComplete();
            return;
          }
        try{
            const response = await paid(String(documentData.email));
            if(!response.ok) throw new Error("Nepodařilo se poslat mail - paid()");
            else alert("Email byl zaslán");
        }catch(error) {
            console.log("Nepodařilo se poslat mail: ", error)
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
            const response = await send(String(documentData.email));
            if(!response.ok) throw new Error("Nepodařilo se poslat mail - send()");
            else alert("Email byl zaslán");
        }catch(error) {
            console.log("Nepodařilo se poslat mail: ", error)
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
