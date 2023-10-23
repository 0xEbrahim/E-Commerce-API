import nodemailer from 'nodemailer';
import asyncHandler from 'express-async-handler';
import { ERROR, FAIL, SUCCESS } from '../utils/errorText.js';
import appError from '../utils/error.js';
import { validateMongoId } from "../utils/validateMongoDBId.js";


const sendEmail = asyncHandler(async(data, req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL,
          pass: process.env.PASS
        }
      });

      const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <abc@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
    })

export {sendEmail}