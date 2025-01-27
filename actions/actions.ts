"use server"

import {Builder, Parser} from "xml2js"
import nodemailer from "nodemailer"
import { client as c } from "@/sanity/lib/client";
import {ActionResponse,User, BarcodeSend, basketItem, Contact, Coupon, Newsletter, Order,SignIn, OrderedItem, Review} from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { sanityFetch } from "@/sanity/lib/client";
import { FIND_COUPON } from "@/sanity/lib/queries";
import { SanityDocument } from "next-sanity";
import { basketSchema,passSchema, userUpdateSchema,userSchema,signSchema, contactSchema, newsletterSchema, orderedSchema, reviewSchema } from "@/lib/schemas"
import puppeteer from 'puppeteer';
import { createSupabaseClient, protectedRoute, getUser } from "@/auth/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
const axios = require("axios")
//passed test
export async function signOut() {
  await protectedRoute()
  const { auth } = await createSupabaseClient("deleteAccount");
  let revalidate = false
  try{
    const signOut = await auth.signOut();
    if(!signOut.error){
      revalidate = true
      return{
      success: true,
      message: "Byl jste úspěšně odhlášen"
    }
    }
  }catch(error){
    console.log("Error při odhlašování: ", error)
    return{
      success: false,
      message: "Nepodařilo se Vás odhlásit"
    }
  }finally{
    if(revalidate){
      revalidatePath("/")
      redirect("/")
    }
  }
}

export async function updatePass(prevState: ActionResponse<{password: string}>, formData: FormData): Promise<ActionResponse<{password: string}>> {
  const { auth } = await createSupabaseClient("deleteAccount");
  let revalidate = false
  try{
    await protectedRoute();
    const password = formData.get("password") as string;
    //const validatedPass = passSchema.safeParse(password)
    
    const {data, error} = await auth.updateUser({
      password: password
    })
    if(error){
      return{
      success: false,
        message: "Nezadali jste správně heslo",
      }
    }else{
    revalidate = true
    return{
      success: true,
      message: "Heslo bylo úspšsně aktualizováno"
    }
  }
  
  }catch(error){
    console.error("Error při změně hesla: ", error)
    return{
      success: false,
      message: "Problém při změně hesla",
      }
  }finally{
    if(revalidate){
      revalidatePath("/user", "page")
    }
  }
}
//passed test
export async function deleteAccount() {
  
  const { auth } = await createSupabaseClient("deleteAccount");
  const user = await getUser()
  try{
    await protectedRoute()
    const signOut = await auth.signOut();
    if(signOut.error) throw signOut.error;

    const {data, error} = await auth.admin.deleteUser(user?.id as string);
    if(!error){
      const result = await c.delete(user?.sanity_id as string)
      return{
      success: true,
      message: "Byl jste úspěšně vymazán"
    }
    }
  }catch(error){
    console.log("Error při mazání účtu: ", error)
    return{
      success: false,
      message: "Nepodařilo se Váš účet vymazat"
    }
  }
}

export async function updateForgotPass(prevState: ActionResponse<SignIn>, formData: FormData): Promise<ActionResponse<SignIn>> {
  const {auth} = await createSupabaseClient();
  let redirectPath = ""
  try{
    //await protectedRoute()
    const code = formData.get("code") as string
    const myData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }
    //const password= formData.get("password") as string
    //const validatedData = signSchema.safeParse(myData  
      const codeExchange = await auth.exchangeCodeForSession(code)
      if(codeExchange.error) return {
        success: false,
        message: "Nepodařilo se Vás ověřit"
      }
      const {data, error} = await auth.updateUser({
        password: myData.password
      })
      if(error){
        return{
          success: false,
          message: "Chyba při vkládání dat.",
        }
      }else{
        redirectPath = "/signin"
        return {
          success: true,
          message: "Vaše heslo bylo aktualizováno. Přihlaste se"
        }
      }
    
  }catch(error){
    console.error("Error in uodate forgot password: ", error)
    return {
      success: false,
      message: "Chyba při aktualizaci hesla."
    }
  }finally{
    if(redirectPath){
      revalidatePath("/update-pass")
      redirect(redirectPath)
    }
  }
}
//passed test
export async function forgotPass(prevState: ActionResponse<{email: string}>, formData: FormData): Promise<ActionResponse<{email: string}>> {
  const client = await createSupabaseClient()
  let revalidate = false;
  try{
    const email = formData.get("email") as string;  
    const { data,error } = await client.auth.resetPasswordForEmail(
        email
      );
      if(error){
        return {
          success: false,
          message: "Nepodařilo se zaslat mail",
          inputs: {email}
        }
      }else {
        revalidate=true
        return {
          success: true,
          message: "Zkontrolujte emailovou schránku"
        }
      }
  }catch(error){
    console.log(error)
    return {
      success: false,
      message: "Nepodařilo se zaslat mail",
    }
  }finally{
    if(revalidate) revalidatePath("/signin")
  }
}
//passed test
export async function signInFn(prevState: ActionResponse<SignIn>, formData: FormData): Promise<ActionResponse<SignIn>> {
  const client = await createSupabaseClient()
  let redirectPath = "";
  try {
    const data = {
    email: formData.get("email") as string,
      password: formData.get("pass") as string,
  }

  const validatedData = signSchema.safeParse(data)
    
  if (!validatedData.success) {
    return {
      success: false,
      message: 'Nevyplnili jste dobře všechny údaje údaje',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: validatedData.data
    }
  }else{
    const {error} = await client.auth.signInWithPassword(validatedData.data)
    if(error){
      return {
        success: false,
      message: 'Nevyplnili jste dobře všechny údaje údaje',
      inputs: validatedData.data
      }
    }
    redirectPath = "/user"
    return {
      success: true,
      message: 'Byl jste úspěšně přihlášen!',
    }
  }

  }catch(error){
    console.log(error)
    return{
      success: false,
        message: 'Problém s přihlášením zákazníka',
    }
  }finally{
    if(redirectPath){
      revalidatePath("/signin")
      redirect(redirectPath)
    } 
  }
}
//passed test
export async function signUp(prevState: ActionResponse<User>, formData: FormData): Promise<ActionResponse<User>> {
  const client = await createSupabaseClient()
  let type="";
  let revalidate = false;
  try{
    const data = {
      first_name: formData.get("name") as string,
      last_name: formData.get("surname") as string,
      email: formData.get("email") as string,
      password: formData.get("pass") as string,
      ico: Number(formData.get("ico"))
    }

    const validatedData = userSchema.safeParse(data);
    
    if (!validatedData.success) {
      return {
        success: false,
        message: 'Nevyplnili jste dobře všechny údaje údaje',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: validatedData.data
      }
    }else {
      console.log(validatedData.data)
      const {first_name, last_name, ico, password, email} = validatedData.data
      if(ico && ico > 1000){
        const isEnt = await axios.get(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}` ,{"Content-Type": "application/json",})
        console.log(isEnt)
        if(isEnt.status === 200) type="b2b" ;
        console.log(type)
      }else{
         type="b2c"
      }

      const {data, error} = await client.auth.signUp({
        email,
        password,
      })
      if(error){
        console.log(error)
        return {
          success: false,
          message: 'Nepovedlo se vytvořit účet',
          inputs: validatedData.data
        }
      }else{
        const result = await c.create({
          _type: "users",
          email: email
        })
        const create_user = await client.from("profiles").insert({
          id: data.user?.id,first_name: first_name, last_name: last_name, type: type, ico: ico, sanity_id: result._id
        })
        console.log(create_user.statusText)
        if(create_user.error){
          revalidate = true
          return{
            success: false,
          message: 'Nepovedlo se vytvořit účet',
        }
        }
        
        
         return {
        success: true,
        message: 'Byl jste úspěšně registrován! Zaslali jsme Vám ověřovací email. Zkrontrolujte i spam!',
      }
      }
      
    }
    
  }catch(error){
    console.warn(error); 
    return{
      success: false,
        message: 'Problém s registrací zákazníka',
    }
  }finally{
    if(revalidate){
      revalidatePath("/signup")
      redirect("/")
    }   
  }
}
//passed test
export async function updateUser(prevState: ActionResponse<User>, formData: FormData): Promise<ActionResponse<User>> {
  const client = await createSupabaseClient()
  let type="";
  let revalidate = false;
  try{
    const data = {
      first_name: formData.get("name") as string,
      last_name: formData.get("surname") as string,
      email: formData.get("email") as string,
      ico: Number(formData.get("ico"))
    }

    const validatedData = userUpdateSchema.safeParse(data);
    
    if (!validatedData.success) {
      return {
        success: false,
        message: 'Nevyplnili jste dobře všechny údaje údaje',
        errors: validatedData.error.flatten().fieldErrors,
        inputs: validatedData.data
      }
    }else {
      console.log(validatedData.data)
      const {first_name, last_name, ico, email} = validatedData.data
      if(ico && ico > 1000){
        const isEnt = await axios.get(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}` ,{"Content-Type": "application/json",})
        console.log(isEnt)
        if(isEnt.status === 200) type="b2b" ;
        console.log(type)
      }else{
         type="b2c"
      }

      const {data, error} = await client.auth.updateUser({
        email,
      })
      if(error){
        console.log(error)
        return {
          success: false,
          message: 'Nepovedlo se změnit údaje.',
          inputs: validatedData.data
        }
      }else{
        const update_user = await client.from("profiles").update({
          first_name: first_name, last_name: last_name, type: type, ico: ico
        }).eq("id", data.user?.id)
        console.log(update_user.statusText)
        if(update_user.error){
          revalidate = true
          return{
            success: false,
          message: 'Nepovedlo se změnit údaje.',
        }
        }
        
        
         return {
        success: true,
        message: 'Údaje byly úspěšně změněny',
      }
      }
      
    }
    
  }catch(error){
    console.warn(error); 
    return{
      success: false,
        message: 'Problém s registrací zákazníka',
    }
  }finally{
    if(revalidate){
      revalidatePath("/user?names=true")
      redirect("/")
    }   
  }
}

async function getAccessToken() {
  const url = "https://identity.idoklad.cz/server/connect/token";

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Host": "identity.idoklad.cz"
  };

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.IDOKLAD_CLIENT_ID!,
    client_secret: process.env.IDOKLAD_CLIENT_SECRET!,
    scope: "idoklad_api",
  });

  try {
    const response = await axios.post(url, body, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function createInvoice(total: number,fname: string, lname: string, discount: number | null | undefined, orderedItems: OrderedItem[] ){
  console.log(orderedItems)
  const date = new Date();
  const now = date.toISOString().split('T')[0];
  const invoiceUrl = "https://api.idoklad.cz/v3/IssuedInvoices";
  const contactUrl = "https://api.idoklad.cz/v3/Contacts"
  if(discount === null || discount == undefined) discount = 0;

  const accesToken = await getAccessToken()
console.log(accesToken)
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${accesToken}`,
  "Host": "api.idoklad.cz"
};


  const contactBody ={
    CompanyName: `${fname} ${lname}`,
    CountryId: 2,
    DeliveryAddresses: [
      {
      Name: `${fname} ${lname}`,
      }
    ],
  }
  const items = orderedItems.map(item => ({
    Amount: item.quantity,
    DiscountPercentage: 0,
    PriceType: 1,
    VatRateType: 2,
    IsTaxMovement: false,
    Name: `${item.name}` ,
    UnitPrice: item.price
  }));
  
  try{
    const userId = await axios.post(contactUrl, contactBody,{headers})
    console.log("Contact response:", userId.data.Data.Id);
    const invoices = await axios.get(invoiceUrl, {headers})
    console.log("Invoices response:", invoices.data.Data.Items.length+1);
    const body = {
      CurrencyId: 2,//
      DateOfIssue: now,
      DateOfMaturity: now,
      DateOfPayment: now,
      DateOfTaxing: now,
      DiscountPercentage: discount,
      Description: `Faktura za předplatné - ${now} - ${fname} ${lname}`,
      DocumentSerialNumber: invoices.data.Data.Items.length+1,//
      IsEet: false,
      IsIncomeTax: true,
      Items: items,
      NumericSequenceId: 5034542,
      PartnerId: userId.data.Data.Id, //
      PaymentOptionId: 1, //
    };
    

    const idoklad = await axios.post(invoiceUrl, body, {headers})
  console.log("Faktura vytvořena",idoklad.data)
  return idoklad.data

}  catch(error: any){
  if (error.response) {
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
    console.error("Response headers:", error.response.headers);
  } else if (error.request) {
    console.error("Request made, no response received:", error.request);
  } else {
    console.error("Error message:", error.message);
  }
  
}

} 
export async function validateCoupon(formData: FormData){
    let errorMessage = "";
    const coupon= formData.get("coupon") as string
    console.log(coupon)
    try{
        const vCoupon: Coupon = await sanityFetch<Coupon>({query: FIND_COUPON, params: {coupon}});
        if(!vCoupon) errorMessage = "Kupon není validní"
        return { vCoupon}
    }catch(error){
        console.log("Problém s kuponem")
    }

   
}

export async function createOrder(prevSate: ActionResponse<Order> | null, formData: FormData): Promise<ActionResponse<Order>>{
    let products: OrderedItem[] = [];
    let revalidate = false;
    try {
        const length = Number(formData.get("length"))
        for (let i = 0; i < length; i++) {
            const id = formData.get(`id${i}`) as string;
            const variant = formData.get(`variant${i}`) as string ;
            const terpens = formData.get(`terpens${i}`) as string;
            const price = Number(formData.get(`price${i}`));
            const quantity = Number(formData.get(`quan${i}`));
            const name = formData.get(`pname${i}`) as string;
            
            // Construct product object
            const product = {
                _type: "orderedItem",
                _key: uuidv4(),
                productId: { _type: "reference", _ref: id },
                variant: variant,
                terpens: terpens,
                price: price,
                quantity: quantity,
                name: name
            };
    
            products.push(product);
        }
        const order: Order = {
            _type: "orders",
         email: formData.get("email") as string,
       phone: formData.get("phone") as string,
       name: formData.get("name") as string,
       surname: formData.get("surname") as string,
       address: formData.get("address") as string,
       country: formData.get("country") as string,
       region: formData.get("region") as string,
       city : formData.get("city") as string,
       postalCode: formData.get("postalCode") as string,
       total: Number(formData.get("total")),
       cod: formData.get("cod") as string,
       date: formData.get("date") as string,
       status: "Přijatá",
       packetaId: Number(formData.get("packetaId")),     
       couponValue: Number(formData.get("couponValue")),  
    }
    console.log(order)
    const validatedData = orderedSchema.safeParse(order)
    if (!validatedData.success) {
        return {
          success: false,
          message: 'Please fix the errors in the form',
          errors: validatedData.error.flatten().fieldErrors,
          inputs: order
        }
      }
      console.log(validatedData.data)
      const {name, email, phone, _type, surname, address, country, region, postalCode, total,
        cod, status, packetaId, city, date, couponValue
       } = validatedData.data
      if(validatedData.data.cod === "true"){
        //xreate Packeta label
            const packetaCode = await createPacket({name, surname, email, phone,packetaId, total})
            if(!packetaCode) throw new Error("Nepodařilo se vytvořit štítek");
                else {
             const result = await c.create({
                barcode: packetaCode,
                 orderedProducts: products,
                 _type: _type,
                 email: email,
                phone: phone,
                name: name,
                surname: surname,
                address: address,
                country: country,
                region: region,
                city : city,
                postalCode: postalCode,
               total: total,
                cod: cod,
                date: date, 
                status : status,
               packetaId: packetaId,
               couponValue: couponValue
        })
        console.log(result)   
    }
    }else{
        const result = await c.create({
            orderedProducts: products,
            _type: _type,
                 email: email,
                phone: phone,
                name: name,
                surname: surname,
                address: address,
                country: country,
                region: region,
                city : city,
                postalCode: postalCode,
               total: total,
                cod: cod,
                date: date, 
                status : status,
               packetaId: packetaId,
               couponValue: couponValue
        })
        console.log(result)   
    }
    const emailResponse = await created(String(email), order, products);
    if(!emailResponse.ok) throw new Error("Nepodařilo se poslat mail - paid()");
    revalidate=true
    return {
        success: true,
        message: 'Objednávka byla vytvořena úspěšně!',
      }
      
    }catch (error) {
            console.error("Unexpected error:", error);
            return {
                success: false,
                message: 'Nevyplnili jste požadované údaje.',
              }
    }finally{
      if(revalidate){
        revalidatePath("/checkout")
        redirect("/")
      }
    }
}

export async function createBasket(formData: FormData){
    try{
    const basket: basketItem = {
     name:  formData.get("name") as string,
     _id: formData.get("_id") as string,
     price:  Number(formData.get("price")),
     terpen:  formData.get("terpen") as string,
     quantity:  Number(formData.get("quantity")),
     variant:  formData.get("variant") as string,
}
    const validatedData = basketSchema.safeParse(basket)
    if (!validatedData.success) {
        return {
          success: false,
          message: 'Nevyplnili jste údaje',
          errors: validatedData.error.flatten().fieldErrors,
        }
      }
      return {
        success: true,
          message: 'Položka byla přidána do košíku',
        item: validatedData.data
      }
}catch(error){
    console.log(error)
    return {
        success: false,
        message: 'Nevyplnili jste údaje',
      }
}
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
     user: process.env.FROM_EMAIL!,
     pass: process.env.FROM_EMAIL_PASSWORD!,
    }
});

function createHtmlOnCreated(data:Order, products: OrderedItem[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Změna stavu u Vaší objednávky - Hydroocann Natural, s.r.o</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 0; background-color: #222222; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <h1 style="color: #FFFFFF; font-size: 28px; margin: 0;">Změna stavu Vaší objednávky</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #303030; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Važený/á/ ${data.name},</p>
                            <p style="color: #303030; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Píšeme Vám ohledně změny stavu u Vaší objednávky</p>
                            
                            <!-- Status Box -->
                            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                                <tr>
                                    <td align="center" style="background-color: #4C9748; padding: 20px; border-radius: 8px;">
                                        <h2 style="color: #FFFFFF; font-size: 24px; margin: 0;">Změna stavu na: ${data.status}</h2>
                                    </td>
                                </tr>
                            </table>                          
                            <!-- Order Details -->
                            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px; border-collapse: collapse;">
                                <tr style="background-color: #222222; color: #FFFFFF;">
                                    <th style="padding: 10px; text-align: left; border: 1px solid #303030;">Produkt</th>
                                    <th style="padding: 10px; text-align: right; border: 1px solid #303030;">Množství</th>
                                    <th style="padding: 10px; text-align: right; border: 1px solid #303030;">Cena</th>
                                </tr>
                                ${products.map((item: OrderedItem) => `
                                   <tr>
                                    <td style="padding: 10px; border: 1px solid #303030; color: #303030;">${item.name}</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: #303030; text-align: right;">${item.quantity}</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: #303030; text-align: right;">${item.price - (item.price/100*data.couponValue)}</td>
                                </tr>
                                  `).join("")}
                                  <tr style="background-color: #f4f4f4;">
                                    <td colspan="2" style="padding: 10px; border: 1px solid #303030; color: #303030; font-weight: bold; text-align: right;">Sleva:</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: red; font-weight: bold; text-align: right;">${data.couponValue} %</td>
                                </tr>
                                 <tr style="background-color: #f4f4f4;">
                                    <td colspan="2" style="padding: 10px; border: 1px solid #303030; color: #303030; font-weight: bold; text-align: right;">Doprava:</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: red; font-weight: bold; text-align: right;">${data.couponValue ? "Zadarmo": "89 Kč"}</td>
                                </tr>
                                <tr style="background-color: #f4f4f4;">
                                    <td colspan="2" style="padding: 10px; border: 1px solid #303030; color: #303030; font-weight: bold; text-align: right;">Celková cena:</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: #303030; font-weight: bold; text-align: right;">${data.total}</td>
                                </tr>
                            </table>                               
                             <p style="color: #303030; font-size: 14px; line-height: 1.5; margin-top: 30px;">V případě nejasností ohledně Vaší objenávky nás neváhejte kontakt na emailu <strong> <a href="mailto:info@hydroocann.com">info@hydroocann.com</a></strong> na telefonním čísle: <strong> <a href="tel:+420420420420">+420 420 420 420</a></strong></p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 20px 0; background-color: #222222; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                            <p style="color: #FFFFFF; font-size: 14px; margin: 0;">© 2025 Hydroocann Natural s.r.o. Všechna práva vyhrazena.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
}


function createHtml(data:SanityDocument): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Změna stavu u Vaší objednávky - Hydroocann Natural, s.r.o</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 0; background-color: #222222; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <h1 style="color: #FFFFFF; font-size: 28px; margin: 0;">Změna stavu Vaší objednávky</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #303030; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Važený/á/ ${data.name},</p>
                            <p style="color: #303030; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Píšeme Vám ohledně změny stavu u Vaší objednávky</p>
                            
                            <!-- Status Box -->
                            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                                <tr>
                                    <td align="center" style="background-color: #4C9748; padding: 20px; border-radius: 8px;">
                                        <h2 style="color: #FFFFFF; font-size: 24px; margin: 0;">Změna stavu na: ${data.status}</h2>
                                    </td>
                                </tr>
                            </table>                          
                            <!-- Order Details -->
                            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px; border-collapse: collapse;">
                                <tr style="background-color: #222222; color: #FFFFFF;">
                                    <th style="padding: 10px; text-align: left; border: 1px solid #303030;">Produkt</th>
                                    <th style="padding: 10px; text-align: right; border: 1px solid #303030;">Množství</th>
                                    <th style="padding: 10px; text-align: right; border: 1px solid #303030;">Cena</th>
                                </tr>
                                ${data.orderedProducts.map((item: OrderedItem) => `
                                   <tr>
                                    <td style="padding: 10px; border: 1px solid #303030; color: #303030;">${item.name}</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: #303030; text-align: right;">${item.quantity}</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: #303030; text-align: right;">${item.price - (item.price/100*data.couponValue)}</td>
                                </tr>
                                  `).join("")}
                                  <tr style="background-color: #f4f4f4;">
                                    <td colspan="2" style="padding: 10px; border: 1px solid #303030; color: #303030; font-weight: bold; text-align: right;">Sleva:</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: red; font-weight: bold; text-align: right;">${data.couponValue} %</td>
                                </tr>
                                <tr style="background-color: #f4f4f4;">
                                    <td colspan="2" style="padding: 10px; border: 1px solid #303030; color: #303030; font-weight: bold; text-align: right;">Doprava:</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: red; font-weight: bold; text-align: right;">${data.couponValue ? "Zadarmo": "89 Kč"}</td>
                                </tr>

                                <tr style="background-color: #f4f4f4;">
                                    <td colspan="2" style="padding: 10px; border: 1px solid #303030; color: #303030; font-weight: bold; text-align: right;">Celková cena:</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: #303030; font-weight: bold; text-align: right;">${data.total}</td>
                                </tr>
                            </table>                               
                             <p style="color: #303030; font-size: 14px; line-height: 1.5; margin-top: 30px;">V případě nejasností ohledně Vaší objenávky nás neváhejte kontakt na emailu <strong> <a href="mailto:info@hydroocann.com">info@hydroocann.com</a></strong> na telefonním čísle: <strong> <a href="tel:+420420420420">+420 420 420 420</a></strong></p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 20px 0; background-color: #222222; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                            <p style="color: #FFFFFF; font-size: 14px; margin: 0;">© 2025 Hydroocann Natural s.r.o. všechna práva vyhrazena.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
}

export async function created(email:string, data: Order, products: OrderedItem[]){
    let ok = false;
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Objednávka přijata",
        html: createHtmlOnCreated(data, products)
      }
    try{
        const response = await transporter.sendMail(mailOptions);
        if(!response.accepted) ok = false;
        else ok = true;
        
    }catch(error){
        console.error("Nepodařilo se poslat email: ", error);
        ok = false;
    }

    return{
        ok
    }
}

export async function cancelled(email: string){
    let ok = false;
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Objednávka zrušena",
        text: "Vaše objednávka byla z nezjištných důvodů zrušena...",
       
    }
    try{
        const response = await transporter.sendMail(mailOptions);
        if(!response.accepted) ok = false;
        else ok = true;
    }catch(error){
        console.error("Nepodařilo se poslat email: ", error);
        ok = false;
    }

    return{
        ok
    }
}

export async function refunded(email: string){
    let ok = false;
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Objednávka vrácena",
        text: "Vaše objednávka byla vrácena. Peníze jsme poslali obratem na účet.",
    }
    try{
        const response = await transporter.sendMail(mailOptions);
        if(!response.accepted) ok = false;
        else ok = true;
    }catch(error){
        console.error("Nepodařilo se poslat email: ", error);
        ok = false;
    }

    return{
        ok
    }
}

export async function completed(email: string, data: SanityDocument){
    let ok = false;
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Objednávka dokončena",
        html: createHtml(data)
    }
    try{
        const response = await transporter.sendMail(mailOptions);
        if(!response.accepted) ok = false;
        else ok = true;
    }catch(error){
        console.error("Nepodařilo se poslat email: ", error);
        ok = false;
    }

    return{
        ok
    }
}

async function generatePDF(data: SanityDocument) {
  const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .header h1 {
            font-size: 24px;
          }
          .header p {
            font-size: 14px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section h3 {
            font-size: 16px;
            margin-bottom: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table th, table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }
          table th {
            background-color: #f4f4f4;
          }
          .total {
            font-weight: bold;
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header Section -->
          <div class="header">
            <div>
              <h1>FAKTURA</h1>
              <p>Faktura č.: ${data.date}</p>
            </div>
            <div>
              <h2>Hydroocann Natural s.r.o.</h2>
              <p>
                Korunní 2569/108<br />
                Vinohrady<br />
                101 00 Praha<br />
                Česká republika<br />
                IČO: 09706381
              </p>
            </div>
          </div>

          <!-- Recipient Section -->
          <div class="section">
            <h3>Příjemce:</h3>
            <p>
              ${data.name} ${data.surname}<br />
              ${data.address}<br />
              ${data.city}, ${data.postalCode}<br />
              Česká republika
            </p>
          </div>

          <!-- Products Section -->
          <div class="section">
            <h3>Produkty:</h3>
            <table>
              <thead>
                <tr>
                  <th>Popis produktu</th>
                  <th>Varianta</th>
                  <th>Příchuť</th>
                  <th>Množství</th>
                  <th>Cena</th>
                </tr>
              </thead>
              <tbody>
                ${data.orderedProducts
                  .map(
                    (item: OrderedItem) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.variant}</td>
                    <td>${item.terpens}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price - (item.price/100*data.couponValue)} Kč</td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
           
          </div>

          <!-- Total Section -->
          <div class="section">
            ${data.couponValue ? `<h3 class="total">Sleva: ${data.couponValue} %</h3>` : ""}
            <h3 class="total">Doprava: ${data.couponValue ? "Zadarmo": "89 Kč"}</h3>
            <h3 class="total">Celkem: ${data.total} Kč</h3>
          </div>
        </div>
      </body>
    </html>
  `;

    await page.setContent(html)
  const pdfBuffer = Buffer.from(await page.pdf({format: "A4"}))
  await browser.close()
    // Upload to Sanity
    const file = await c.assets.upload("file", pdfBuffer, {
      filename: `${data.date}-${data.name}${data.surname}.pdf`,
      contentType: "application/pdf",
    });
  
    return {
      file,
    };
  }
  
export async function paid(data: SanityDocument){
    let ok = false;

    try{
        const pdf = await generatePDF(data)
        const order = await c.patch(data._id).set({
            invoice: {
              _type: 'file',
              asset: {
                _type: 'reference',
                _ref: pdf.file._id,
              },
            },
          }).commit();

        const response = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: data.email,
            subject: "Objednávka zaplacena",
            text: "Děkujeme za zaplacení Vaší objednávky, předáme ji dopravě",
            html: createHtml(data),
            attachments: 
            [
                {
                  filename: "faktura.pdf",
                  path: pdf.file.url, 
                }
            ]  
        });
        if(!response.accepted) ok = false;
        else ok = true;
    }catch(error){
        console.error("Nepodařilo se poslat email: ", error);
        ok = false;
    }

    return{
        ok
    }
}

export async function send(email: string, data: SanityDocument){
    let ok = false;
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Objednávka vyexpedována",
        html: createHtml(data)
    }
    try{
        const response = await transporter.sendMail(mailOptions);
        if(!response.accepted) ok = false;
        else ok = true;
    }catch(error){
        console.error("Nepodařilo se poslat email: ", error);
        ok = false;
    }

    return{
        ok
    }
}

export async function createPacket({name, surname, email, phone,packetaId, total}: BarcodeSend){
let packetaCode: string = "";
//const {name, surname, email, phone,packetaId, total, cod} = documentData;
        const rBody = {
          createPacket: {
            apiPassword: process.env.PACKETA_API_PASSWORD,
            packetAttributes: {
                number: `${packetaId}${total}${phone}`,
                name: name,
                surname: surname,
                email: email,
                phone: String(phone),
                addressId: packetaId,
                value: total,
                weight: 1,
                eshop: "HydrooCann.com",
                adultContent: true,   
            }
          }
        }
        try{
const packeta = await fetch("https://www.zasilkovna.cz/api/rest", {
    method: "POST",
    body: new Builder().buildObject(rBody)
  })
  const pResponse = await new Parser({explicitArray: false}).parseStringPromise(await packeta.text())
  if(pResponse.response.status !== "ok"){
    console.error("Problém s vytvořením zásilky: ",pResponse.response.status)
    return;
  }
  packetaCode = pResponse.response.result.barcodeText;
  if(!packetaCode) alert("Problém s vytvořením štítku.")
  }catch(error){
    console.error("Error při vytváření packety: ", error)
    }
    return packetaCode
    
} 

  export async function saveNewsletter(prevState: ActionResponse<Newsletter>,formData: FormData): Promise<ActionResponse<Newsletter>> {
    let revalidate = false
    try {
       const newsletter: Newsletter = {
        _type: "newsletter",
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    surname: formData.get("surname") as string,
}
    const validatedData = newsletterSchema.safeParse(newsletter)

    if (!validatedData.success) {
        return {
          success: false,
          message: 'Nevyplnili jste některá pole',
          errors: validatedData.error.flatten().fieldErrors,
          inputs: newsletter
        }
      }
    const result = await c.create({
        ...validatedData.data
    })
    console.log("Newsletter created:", result);
    revalidate=true
    return {
        success: true,
        message: 'Děkujeme za zaslání! Co nejdřív Vám pošleme seznam novinek!',
      }
  }catch(error){
    console.log(error);
    return {
        success: false,
        message: 'Nepovedlo se odeslat Vaše údaje',
      }
  }finally{
    revalidatePath("/", "layout")
  }
  } 

  export async function saveContact(prevState: ActionResponse<Contact> | null,formData: FormData): Promise<ActionResponse<Contact>>{
    let revalidate = false
    try {
    const contact: Contact = {
        _type: "contact",
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    tel: formData.get("tel") as string,
   msg: formData.get("msg") as string,
    ltd: formData.get("company") as string,
}
    const validatedData = contactSchema.safeParse(contact)
    if (!validatedData.success) {
        return {
          success: false,
          message: 'Nevyplnili jste pole.',
          errors: validatedData.error.flatten().fieldErrors,
          inputs: contact
        }
      }
    
    const result = await c.create({
        ...validatedData.data
    })
    console.log("Contact created:", result);
    revalidate=true
    return {
        success: true,
        message: 'Děkujeme za zaslání! Co nejdřív vyřešíme Váš požadavek',
      }
  }catch(error){
    console.log(error);
    return {
        success: false,
        message: 'Nepovedlo se odeslat Váš požadavek',
      }
   
  }finally{
    if(revalidate){
      revalidatePath("/kontakt")
    }
  }
  } 

  export async function saveReview(prevState: ActionResponse<Review>,formData: FormData): Promise<ActionResponse<Review>>{
    let revalidate = false
    try {
    const review: Review = {
    _type: "reviews",
     name:  formData.get("name") as string,
     review:  formData.get("review") as string,
     rating:  Number(formData.get("rating")),
     product:  {
        _type: "reference",
        _ref:formData.get("_id") as string,}
    }
    
    const validatedData = reviewSchema.safeParse(review)

    if (!validatedData.success) {
        return {
          success: false,
          message: 'Nevyplnili jste pole',
          errors: validatedData.error.flatten().fieldErrors,
          inputs: review
        }
      }
    const result = await c.create({
        ...validatedData.data
    })
    console.log("Review created:", result);
    revalidate=true
    return {
        success: true,
        message: 'Děkujeme za zaslání hodnocení! Po prověření ho zveřejníme',
      }
    
  }catch(error){
     console.log(error);
     return {
        success: false,
        message: 'Nepodařilo se odeslat Vaše hodnocení',
      }
  }finally{
    if(revalidate){
      revalidatePath("/products", "layout")
      redirect("/products")
    }
  }
  } 