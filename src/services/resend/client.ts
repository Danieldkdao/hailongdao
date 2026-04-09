import { envServer } from "@/data/data/server";
import { Resend } from "resend";

export const resend = new Resend(envServer.RESEND_API_KEY);
