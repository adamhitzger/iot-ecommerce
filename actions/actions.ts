"use server"

import { transporter } from "@/lib/utils"

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
        text: "Vaše objednávka byla vrácena. Peníze jsme poslaliobratem na účet.",
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