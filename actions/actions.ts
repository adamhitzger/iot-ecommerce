"use server"


import { SanityDocument } from "next-sanity";
import {Builder, Parser} from "xml2js"
import nodemailer,{createTransport } from "nodemailer"
import { client } from "@/sanity/lib/client";

export async function createBasket(formData: FormData){
    const name: string = formData.get("name") as string;
    const _id:string = formData.get("_id") as string;
    const price: number = Number(formData.get("price"));
    const terpen: string = formData.get("terpen") as string;
    const quantity: number = Number(formData.get("quantity"));
    const variant: string = formData.get("variant") as string;

    return {
        name,
        _id,
        price,
        terpen,
        variant,
        quantity
    }
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
     user: process.env.FROM_EMAIL!,
     pass: process.env.FROM_EMAIL_PASSWORD!,
    }
});

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

export async function completed(email: string){
    let ok = false;
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Objednávka dokončena",
        text: "Vaše objednávka byla vyzvednuta",
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

export async function paid(email: string){
    let ok = false;
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Objednávka zaplacena",
        text: "Děkujeme za zaplacení Vaší objednávky, předáme ji dopravě",
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

export async function send(email: string){
    let ok = false;
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Objednávka vyexpedována",
        text: "Vaše objednávka byla předána dopravci",
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

export async function createPacket(documentData: SanityDocument){
let packetaCode: string = "";
const {name, surname, email, phone,packetaId, total} = documentData;
        const rBody = {
          createPacket: {
            apiPassword: process.env.PACKETA_API_PASSWORD,
            packetAttributes: {
                number: `${total}${phone}`,
                name: name,
                surname: surname,
                email: email,
                phone: String(phone),
                addressId: packetaId,
                value: total,
                weight: 1,
                eshop: "HydrooCann.com"
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

  export async function saveNewsletter(formData: FormData){
    let name: string = "";
    let email: string = "";
    let surname: string = "";
    name = formData.get("name") as string;
    email = formData.get("email") as string;
    surname = formData.get("surname") as string;
    try {
    const result = await client.create({
        _type: "newsletter",
        name: name,
        surname: surname,
        email: email,

    })
    console.log("Newsletter created:", result);
  }catch(error){
    console.log(error);
  }
  } 

  export async function saveContact(formData: FormData){
    let name: string = "";
    let email: string = "";
    let tel: string = "";
    let ltd: string = "";
    let msg: string = "";
    name = formData.get("name") as string;
    email = formData.get("email") as string;
    tel = formData.get("tel") as string;
   msg = formData.get("msg") as string;
    ltd = formData.get("company") as string;
    try {
    const result = await client.create({
        _type: "contact",
        fullname: name,
        msg: msg,
        tel: tel,
        ltd: ltd,
        email: email,

    })
    console.log("Contact created:", result);
  }catch(error){
    console.log(error);
  }
  } 

  export async function saveReview(formData: FormData){
    let name: string = formData.get("name") as string;
    let review: string = formData.get("review") as string;
    let rating: number = Number(formData.get("rating"));
    let id: string = formData.get("_id") as string;
    try {
    const result = await client.create({
        _type: "reviews",
        name: name,
        review: review,
        rating: rating,
        product: {
            _type: "reference",
            _ref: id
        }
    })
    console.log("Review created:", result);
  }catch(error){
    console.log(error);
  }
  } 