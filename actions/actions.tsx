"use server"

import {Builder, Parser} from "xml2js"
import nodemailer from "nodemailer"
import { client as c } from "@/sanity/lib/client";
import {ActionResponse,User, BarcodeSend, basketItem, Contact, Coupon, Order,SignIn, OrderedItem, Review, Campaign, Products} from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { sanityFetch } from "@/sanity/lib/client";
import { FIND_COUPON, GET_CUR_USER, GET_VERIFY_CODE, USER_BY_EMAIL } from "@/sanity/lib/queries";
import { basketSchema, userUpdateSchema,userSchema,signSchema, contactSchema, newsletterSchema, orderedSchema, reviewSchema, zodOrder } from "@/lib/schemas"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { removeUserFromSession, createUserSession } from "@/auth/session";
import { cookies } from "next/headers";
import axios from "axios";
import path from "path";
import os from  "os"
import {render} from "@react-email/render"
import NewsletterCampaignEmail from "@/components/email/newsletter";
import fs from "fs/promises"
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit"

export async function signOutFromNewsletter(prevState: ActionResponse<SignIn>, formData: FormData): Promise<ActionResponse<SignIn>> {
   let revalidate = false;
   try {
      const data = {
    email: formData.get("email") as string,
  }

  const validatedData = signSchema.safeParse(data)
    
  if (!validatedData.success) {
    return {
      success: false,
      message: 'Nevyplnili jste dobře všechny údaje údaje',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: validatedData.data
    }
  }
  const get_id = await sanityFetch<User[]>({
    query: GET_CUR_USER,
    params:{email: validatedData.data.email},
  })
  const id = get_id[0]._id as string
    await c.patch(id).set(
      {
      _id: id,
      _type: "users",
      souhlas: false,
    }
    ).commit();

    revalidate = true;

    return {
      success: true,
      message: "Byl jste odhlášen z newsletteru"
    };

  } catch (error) {
    console.warn("Chyba při aktualizaci uživatele:", error);
    return {
      success: false,
      message: "Problém s odhlášením uživatele z newsletteru"
    };
  } finally {
    if (revalidate) {
      revalidatePath("/user?names=true");
      redirect("/");
    }
  }
}

export async function paid(data: Order, id: string){
    let ok = false;
    console.log(data)
    try{
        const pdf = await generatePDF(data)
        const order = await c.patch(id).set({
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
            to: data.user.email,
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
//passed test
export async function signOut() {
  await removeUserFromSession(await cookies());
     revalidatePath("/", "layout")
     redirect("/")
}
//passed test
export async function signUp(prevState: ActionResponse<User>, formData: FormData): Promise<ActionResponse<User>> {
  let type="";
  let revalidate = false;
  try{
    const data = {
      first_name: formData.get("name") as string,
      last_name: formData.get("surname") as string,
      email: formData.get("email") as string,
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
      const {first_name, last_name, ico, email} = validatedData.data
      if(ico && ico > 1000){
        const isEnt = await axios.get(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}` ,{headers: {"Content-Type": "application/json"}})
        console.log(isEnt)
        if(isEnt.status === 200) type="bussiness" ;
        console.log(type)
      }else{
         type="customer"
      }

      const userExist = await sanityFetch<User[]>({
          query: USER_BY_EMAIL,
          params: { email },
      })
      console.log("User id:", userExist);
      if (!userExist[0]?._id){
          const createCus = await c.create({
             _type: "users",
              name: first_name,
              surname: last_name,
              email: email,
              souhlas: true,
              type: type,
              ico: ico,
              event_type: "signUp"
          })
        }
        
         return {
        success: true,
        message: 'Byl jste úspěšně registrován! Zaslali jsme Vám ověřovací email. Zkrontrolujte i spam!',
      }
      }
      
    }
    
  catch(error){
    console.warn(error); 
    return{
      success: false,
        message: 'Problém s registrací zákazníka',
    }
  }finally{
    if(revalidate){
      revalidatePath("/signup")
      redirect("/signin")
    }   
  }
}
export async function signInFn(prevState: ActionResponse<SignIn>, formData: FormData): Promise<ActionResponse<SignIn>> {
  let redirectPath = "";
  try {
    const data = {
    email: formData.get("email") as string,
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
    const verifyCode = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    const createCode = await c.create({
      _type: "verifyCodes",
      code: verifyCode,
      email: validatedData.data.email,
    })
    redirectPath = "/verify"
    const sendMail = await transporter.sendMail({
       from: process.env.FROM_EMAIL,
        to: validatedData.data.email,
        subject: "Ověřovací kód",
       html: createVerificationEmail(verifyCode),
    })
    if(!sendMail.accepted){
return {
      success: false,
      message: "Nepodřilo se Vám zaslat e-mail. Zkuste jiný.",
    }
    }else{
    return {
      success: true,
      message: 'Byl Vám zaslán ověřovací kód, zkrontrolujte email',
    }
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
export async function verifyCodeFn(prevState: ActionResponse<{ code: string }>, formData: FormData):Promise<ActionResponse<{ code: string }>>{
  let revalidate = false
  try{
    const code = formData.get("code")as string;
    const verifyCode = await sanityFetch<Array<{code: string, _id: string, email: string}>>({
      query: GET_VERIFY_CODE,
      params: {code: code}
    })
    console.log(verifyCode)
    if(code === verifyCode[0].code){
      await c.delete(verifyCode[0]._id)
      await createUserSession(verifyCode[0].email, await cookies())
      revalidate=true
      return{
    success: true,
    message: "Jste přihlášen!"
  }
    }
  }catch(error){
    console.log(error)
    return{
    success: false,
    message: "Nebyl jste přihlášen"
  }
  }finally{
    if(revalidate){
      revalidatePath("/signin")
      redirect("/user")
    }else{
      return{
    success: false,
    message: "Nebyl jste přihlášen"
  }
    }
  }
   
}
//passed test
export async function updateUser(
  prevState: ActionResponse<User>,
  formData: FormData
): Promise<ActionResponse<User>> {

  let type = "";
  let revalidate = false;

  try {
    // získání všech dat z formuláře
    const data = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      surname: formData.get("surname") as string,
      email: formData.get("email") as string,
      tel: formData.get("tel") as string | undefined,
      souhlas: formData.get("souhlas") === "on" ? true : false,
      country: formData.get("country") as string | undefined,
      region: formData.get("region") as string | undefined,
      postalCode: formData.get("postalCode") as string | undefined,
      city: formData.get("city") as string | undefined,
      address: formData.get("address") as string | undefined,
      ico: formData.get("ico") ? Number(formData.get("ico")) : undefined
    };

    // validace
    const validatedData = userUpdateSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Nevyplnili jste dobře všechny údaje",
        errors: validatedData.error.flatten().fieldErrors,
        inputs: validatedData.data
      };
    }

    // logika pro b2b / b2c
    const { id, name, surname, ico, email, tel, souhlas, region, postalCode, country, city, address} = validatedData.data;
    if (ico && ico > 1000) {
      const isEnt = await axios.get(
        `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (isEnt.status === 200) type = "bussiness";
    } else {
      type = "customer";
    }

    // patch přes client API
    await c.patch(id).set(
      {
      _id: id,
      _type: "users",
      name:name,
      surname:surname,
      email: email,
      tel:tel,
      address: address,
      souhlas: souhlas,
      region: region,
      postalCode: postalCode,
     country:country,
      city: city,
    }
    ).commit();

    revalidate = true;

    return {
      success: true,
      message: "Údaje uživatele byly úspěšně aktualizovány"
    };

  } catch (error) {
    console.warn("Chyba při aktualizaci uživatele:", error);
    return {
      success: false,
      message: "Problém s aktualizací uživatele"
    };
  } finally {
    if (revalidate) {
      revalidatePath("/user?names=true");
      redirect("/");
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
      Description: `Faktura - ${now} - ${fname} ${lname}`,
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
    let revalidate,success = false;
    let id = "";
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

            await c.patch(id).dec({quantity: quantity}).commit();
        }
 

        const order: zodOrder = {
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
       del: Number(formData.get("del")),  
    }
    console.log(order)
    const validatedData = orderedSchema.safeParse(order)
    console.log('Please fix the errors in the form')
    if (!validatedData.success) {
        return {
          success: false,
          message: 'Please fix the errors in the form',
          errors: validatedData.error.flatten().fieldErrors,
        }
      }
      console.log(validatedData.data)
      const {name, email, phone, _type, surname, address, country, region, postalCode, total,
        cod, status, packetaId, city, date, couponValue, del
       } = validatedData.data
      const userExist = await sanityFetch<User[]>({
          query: USER_BY_EMAIL,
          params: { email: email },
    })
     console.log("User id:", userExist);
    if (!userExist[0]?._id){
      const result = await c.create({
      _type: "users",
      name: name,
      surname: surname,
      email: email,
      tel: phone,
      souhlas: true,
      event_type: "order",
      address: address,
      country: country,
      region: region,
      city : city,
       postalCode: postalCode,
    })
    id = result._id
    }else{
      id = userExist[0]._id
      const updateLocation = await c.patch(id)
      .setIfMissing({
        address: address,
      country: country,
      region: region,
      city : city,
       postalCode: postalCode,
      }).set({souhlas: true}).commit()
    }
      if(validatedData.data.cod === "true"){
        //create Packeta label
            const packetaCode = await createPacket({name, surname, email, phone,packetaId, total})
            if(!packetaCode) console.log("Nepodařilo se vytvořit štítek");
                else {
             const result = await c.create({
                barcode: packetaCode,
                 orderedProducts: products,
                 _type: _type,
                 user: {
                    _type: "reference",
                    _ref: id, 
                 },
               
               total: total,
                cod: cod,
                date: date, 
                status : status,
               packetaId: packetaId,
               couponValue: couponValue,
               free_del: del && del > 0 ? true : false
        })
        
    }
    }else{
        const result = await c.create({
            orderedProducts: products,
            _type: _type,
              user: {
                    _type: "reference",
                    _ref: id, 
              },
               total: total,
                cod: cod,
                date: date, 
                status : status,
               packetaId: packetaId,
               couponValue: couponValue
        })
    }
    const emailResponse = await created(String(email), order, products);
    if(!emailResponse.ok){ 
      success = false
      console.log("Nepodařilo se poslat mail - paid()");
    } else{
    revalidate=true
    success = true
    return {
        success: true,
        message: 'Objednávka byla vytvořena úspěšně!',
      }
    }
    }catch (error) {
            console.error("Unexpected error:", error);
            return {
                success: false,
                message: 'Nevyplnili jste požadované údaje.',
              }
    }finally{
      if(revalidate && success){
        revalidatePath("/checkout")
        redirect("/platba/provedena")
      }else{
        redirect("/platba/error")
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
     host: "smtp.seznam.cz",
        port: 587,
        secure: false,
        auth: {
         user: process.env.FROM_EMAIL!,
         pass: process.env.FROM_EMAIL_PASSWORD!,
        },
        tls: {
         ciphers: "SSLv3"
        } 
});

function createHtmlOnCreated(data:zodOrder, products: OrderedItem[]): string {
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
                                    <td style="padding: 10px; border: 1px solid #303030; color: #303030; text-align: right;">${item.price - (item.price/100*(data.couponValue ?? 0))}</td>
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

function createHtml(data:Order): string {
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
                            <p style="color: #303030; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Važený/á/ ${data.user.name},</p>
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
                                ${data?.orderedProducts && data.orderedProducts.map((item: OrderedItem) => `
                                   <tr>
                                    <td style="padding: 10px; border: 1px solid #303030; color: #303030;">${item.name}</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: #303030; text-align: right;">${item.quantity}</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: #303030; text-align: right;">${item.price - (item.price/100*data.couponValue)}</td>
                                </tr>
                                  `).join("")}
                                  <tr style="background-color: #f4f4f4;">
                                    <td colspan="2" style="padding: 10px; border: 1px solid #303030; color: #303030; font-weight: bold; text-align: right;">Sleva:</td>
                                    <td style="padding: 10px; border: 1px solid #303030; color: red; font-weight: bold; text-align: right;">${data.couponValue} Kč</td>
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

function createVerificationEmail(code: string): string {
  return `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ověřovací kód - Hydroocann Natural, s.r.o.</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 0; background-color: #222222; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <h1 style="color: #FFFFFF; font-size: 28px; margin: 0;">Ověření Vaší identity</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #303030; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                Dobrý den,
              </p>
              <p style="color: #303030; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                Pro ověření Vaší identity použijte prosím následující kód:
              </p>

              <!-- VERIFICATION CODE BOX -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="background-color: #4C9748; padding: 25px; border-radius: 8px;">
                    <h2 style="color: #FFFFFF; font-size: 36px; letter-spacing: 8px; font-weight: bold; margin: 0;">
                      ${code}
                    </h2>
                  </td>
                </tr>
              </table>

              <p style="color: #303030; font-size: 14px; line-height: 1.5;">
                Kód je platný po dobu <strong>10 minut</strong>. Pokud jste o ověření nežádali, tento e-mail prosím ignorujte.
              </p>

              <p style="color: #303030; font-size: 14px; line-height: 1.5; margin-top: 30px;">
                V případě dotazů nás kontaktujte na <a href="mailto:info@hydroocann.com" style="color:#4C9748; text-decoration:none;">info@hydroocann.com</a>.
              </p>
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
</html>`;
}

export async function created(email:string, data: zodOrder, products: OrderedItem[]){
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

export async function emailCampaign(email:string, data: Campaign, products: Products){
    let ok = false;
    const html = await render(<NewsletterCampaignEmail 
      emailBody={data.emailBody} 
      emailHeading={data.emailHeading} 
      emailSubject={data.emailSubject} 
      products={products}
      email={email}
      campaignCode={data.campaignCode}
      utmTerm={data.utmTerm}
      utmContent={data.utmContent}
      />)
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: data.emailSubject,
        html: html,
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

export async function completed(email: string, data: Order){
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

export async function generateInvoicePDF(data: Order) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontBytes = await fs.readFile("public/fonts/Roboto-Regular.ttf");
  const font = await pdfDoc.embedFont(fontBytes);

  const left = 50;
  const right = width - 50;
  let y = height - 50;

  /* ========= BAREVNÝ PRUH ========= */
  page.drawRectangle({
    x: 0,
    y: height - 8,
    width,
    height: 8,
    color: rgb(0.15, 0.55, 0.4),
  });

  /* ========= HLAVIČKA ========= */
  page.drawText("FAKTURA", {
    x: left,
    y,
    size: 26,
    font,
  });

  page.drawText(`Faktura č.: ${data.date}`, {
    x: left,
    y: y - 28,
    size: 11,
    font,
  });

  let yCompany = height - 50;
  const companyX = 340;

  [
    ["Hydroocann Natural s.r.o.", 16],
    ["Korunní 2569/108", 11],
    ["Vinohrady", 11],
    ["101 00 Praha", 11],
    ["Česká republika", 11],
    ["IČO: 09706381", 11],
  ].forEach(([text, size]) => {
    page.drawText(text as string, {
      x: companyX,
      y: yCompany,
      size: size as number,
      font,
    });
    yCompany -= 15;
  });

 

  /* ========= PŘÍJEMCE ========= */
  page.drawText("Příjemce", {
    x: left,
    y,
    size: 15,
    font,
  });
  y -= 22;

  [
    `${data.user.name} ${data.user.surname}`,
    data.user.address,
    `${data.user.postalCode} ${data.user.city}`,
    data.user.country,
  ].forEach(line => {
    page.drawText(line as string, {
      x: left,
      y,
      size: 11,
      font,
    });
    y -= 14;
  });

  /* ========= TABULKA PRODUKTŮ ========= */
  y -= 30;
  page.drawText("Produkty", {
    x: left,
    y,
    size: 15,
    font,
  });
  y -= 18;

  const tableX = left;
  const colWidths = [180, 80, 80, 60, 80];
  const headers = ["Popis produktu", "Varianta", "Příchuť", "Ks", "Cena"];

  // hlavička tabulky – pozadí
  page.drawRectangle({
    x: tableX,
    y: y - 4,
    width: colWidths.reduce((a, b) => a + b),
    height: 20,
    color: rgb(0.95, 0.95, 0.95),
  });

  let x = tableX;
  headers.forEach((h, i) => {
    page.drawText(h, {
      x,
      y,
      size: 11,
      font,
    });
    x += colWidths[i];
  });

  y -= 22;

  data.orderedProducts?.forEach(item => {
    x = tableX;

    const price =
      item.price - (item.price / 100) * (data.couponValue || 0);

    const row = [
      item.name,
      item.variant || "-",
      item.terpens || "-",
      String(item.quantity),
      `${price.toFixed(2)} Kč`,
    ];

    row.forEach((cell, i) => {
      page.drawText(cell as string, {
        x,
        y,
        size: 11,
        font,
      });
      x += colWidths[i];
    });

    // spodní čára řádku
    page.drawLine({
      start: { x: tableX, y: y - 3 },
      end: { x: tableX + colWidths.reduce((a, b) => a + b), y: y - 3 },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.85),
    });

    y -= 18;
  });

  /* ========= SOUHRN ========= */
  y -= 30;
  const summaryX = 360;
  const shipping = data.free_del ? 0 : 89;

  // sleva
  if (Number(data.couponValue) > 0) {
    page.drawText(`Sleva: ${data.couponValue} Kč`, {
      x: summaryX,
      y,
      size: 11,
      font,
    });
    y -= 18;
  }

  // doprava
  page.drawText("Doprava", {
    x: summaryX,
    y,
    size: 11,
    font,
  });

  const shippingText = shipping === 0 ? "Zdarma" : `${shipping} Kč`;
  const shipWidth = font.widthOfTextAtSize(shippingText, 11);
  page.drawText(shippingText, {
    x: right - shipWidth,
    y,
    size: 11,
    font,
  });

  y -= 28;

  /* ========= DPH BOX ========= */
  const VAT_RATE = 0.21;
  const total = data.total;
  const base = +(total / (1 + VAT_RATE)).toFixed(2);
  const vat = +(total - base).toFixed(2);

  page.drawRectangle({
    x: summaryX - 10,
    y: y - 85,
    width: right - summaryX + 10,
    height: 85,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.7, 0.7),
  });

  const rows = [
    ["Základ bez DPH", `${base} Kč`],
    ["DPH 21 %", `${vat} Kč`],
    ["Celkem k úhradě", `${total} Kč`],
  ];

  rows.forEach(([label, value], i) => {
    const size = i === 2 ? 14 : 11;
    const offset = i * 24;

    page.drawText(label, {
      x: summaryX,
      y: y - offset,
      size,
      font,
    });

    const w = font.widthOfTextAtSize(value, size);
    page.drawText(value, {
      x: right - w,
      y: y - offset,
      size,
      font,
    });
  });

  /* ========= EXPORT ========= */
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

async function generatePDF(data: Order) {
    const buffer = await generateInvoicePDF(data)

    const file = await c.assets.upload("file", buffer, {
      filename: `${data.date}-${data.user.name}${data.user.surname}.pdf`,
      contentType: "application/pdf",
    });
  
    return {
      file,
    };
}

export async function send(email: string, data: Order){
    let ok = false;
    console.log(email)
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

export async function sms(to: string, text: string, code: string):Promise<boolean>{
  console.log("TO: +420",to)
  console.log("Text:", text)
  console.log("Code:", code)
  console.log("From:", process.env.TWILIO_PHONE_NUMBER!)
  console.log(`+420${to}`)
  try{
    const response = await axios.get("https://smsgateapi.sms-sluzba.cz/apilite30/sms",
      {
        params: {
          text: text,
          number: to,
          login: process.env.SMS_ACCOUNT!,
          password: process.env.SMS_ACCOUNT_PASS!
        }
      }
    );
    console.log(response.data)
    if(response.status === 200){
      return true;
    }else{
      return false;
    }
    
  }catch(error: any){
    console.log("Error:",error.message)
    return false;
  }
}

export async function saveNewsletter(prevState: ActionResponse<User>,formData: FormData): Promise<ActionResponse<User>> {
    let revalidate = false
    try {
       const newsletter: User = {
        _type: "users",
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        surname: formData.get("surname") as string,
        event_type: "newsletter"
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
      const data = validatedData.data
      const userExist = await sanityFetch<User[]>({
          query: USER_BY_EMAIL,
          params: { email: data.email },
    })
    if (userExist[0]?._id){
      const patch = await c.patch(userExist[0]._id).set({souhlas: true}).commit();
      return {
        success: true,
        message: 'Děkujeme za zaslání! Co nejdřív Vám pošleme seznam novinek!',
      }
    }else{
    const result = await c.create({
        ...validatedData.data,
        event_type: "newsletter",
        souhlas: true,
    })
    
    console.log("Newsletter created:", result);
    }
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
    if(revalidate){
    revalidatePath("/", "layout")
    }
  }
} 

export async function saveContact(prevState: ActionResponse<Contact> | null,formData: FormData): Promise<ActionResponse<Contact>>{
    let revalidate = false
    try {
    const contact: Contact = {
        _type: "contact",
    name: formData.get("name") as string,
    surname: formData.get("surname") as string,
    email: formData.get("email") as string,
    tel: formData.get("tel") as string,
    msg: formData.get("msg") as string,
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
    const data = validatedData.data;

    const userExist = await sanityFetch<User[]>({
          query: USER_BY_EMAIL,
          params: { email: data.email },
    })
    console.log("User id:", userExist);
    if (userExist[0]?._id){
       const qContact = await c.create({
        _type: "contact",
        msg: data.msg,
        user:  {
          _type: "reference",
          _ref: userExist[0]._id
        }
    })
      return {
        success: true,
        message: 'Děkujeme za zaslání! Co nejdřív vyřešíme Váš požadavek',
      }
    }else{
    const result = await c.create({
      _type: "users",
      name: data.name,
      surname: data.surname,
      email: data.email,
      tel: data.tel,
      souhlas: false,
      event_type: "contact"
    })
    const qContact = await c.create({
        _type: "contact",
        msg: data.msg,
        user: {
          _type: "reference",
          _ref: result._id
        }
    })
    console.log("Contact created:", result);
}
   

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

export async function saveReview(prevState: ActionResponse<User>,formData: FormData): Promise<ActionResponse<User>>{
    let revalidate = false
    try {
    const review = {
    _type: "reviews",
     name:  formData.get("name") as string,
     surname: formData.get("surname") as string,
     email: formData.get("email") as string,
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
        }
      }
    
         const data = validatedData.data;

    const userExist = await sanityFetch<User[]>({
          query: USER_BY_EMAIL,
          params: { email: data.email },
    })
    console.log("User id:", userExist);
    if (userExist[0]?._id){
      const addReview = await c.create({
        _type: data._type,
        review: data.review,
        rating: data.rating,
        product: data.product,
        user: {
          _type: "reference",
          _ref: userExist[0]._id
        }
      });
      return {
        success: true,
        message: 'Děkujeme za zaslání hodnocení! Po prověření ho zveřejníme',
      }
    }else{
      const result = await c.create({
      _type: "users",
      name: data.name,
      surname: data.surname,
      email: data.email,
      souhlas: false,
      event_type: "review"
    })
    console.log("Review created:", result);
    const addReview = await c.create({
        _type: data._type,
        review: data.review,
        rating: data.rating,
        product: data.product,
        user: {
          _type: "reference",
          _ref: userExist[0]._id
        }
      });
    }
   
    
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