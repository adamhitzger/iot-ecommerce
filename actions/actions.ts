"use server"

import {Builder, Parser} from "xml2js"
import nodemailer from "nodemailer"
import { client } from "@/sanity/lib/client";
import {ActionResponse, BarcodeSend, basketItem, Contact, Coupon, Newsletter, Order, OrderedItem, Review} from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { sanityFetch } from "@/sanity/lib/client";
import { FIND_COUPON } from "@/sanity/lib/queries";
import { SanityDocument } from "next-sanity";
import { basketSchema, contactSchema, newsletterSchema, orderedSchema, reviewSchema } from "@/lib/schemas"
import "@/public/inconsolata.js"
import puppeteer from 'puppeteer';
const axios = require("axios")

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
             const result = await client.create({
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
        const result = await client.create({
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
    const emailResponse = await created(String(email));
    if(!emailResponse.ok) throw new Error("Nepodařilo se poslat mail - paid()");
    
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
          message: 'položka byla přidána do košíku',
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

export async function created(email: string){
    let ok = false;
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Objednávka přijata",
        text: "Vaši objednávku jsme přijali. Co nevidět ji zašleme",
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
    const file = await client.assets.upload("file", pdfBuffer, {
      filename: `${data.date} - ${data.name} ${data.surname}.pdf`,
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
        const order = await client.patch(data._id).set({
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
    const result = await client.create({
        ...validatedData.data
    })
    console.log("Newsletter created:", result);
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
  }
  } 

  export async function saveContact(prevState: ActionResponse<Contact> | null,formData: FormData): Promise<ActionResponse<Contact>>{
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
    
    const result = await client.create({
        ...validatedData.data
    })
    console.log("Contact created:", result);
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
   
  }
  } 

  export async function saveReview(prevState: ActionResponse<Review>,formData: FormData): Promise<ActionResponse<Review>>{
    
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
    const result = await client.create({
        ...validatedData.data
    })
    console.log("Review created:", result);
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
  }
  } 