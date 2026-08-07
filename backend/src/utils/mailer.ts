import nodemailer from "nodemailer";

export interface MailDetails {
  name: string;
  email: string;
  phone: string;
  message: string;
  whatsappNumber?: string;
  country?: string;
  planningDate?: string;
  flexibleDates?: boolean;
  adults?: number;
  children?: number;
  duration?: string;
  preferredContact?: string;
  interestedIn?: string[];
  preferredAccommodation?: string;
  howFound?: string;
  createdAt: Date;
}

export const sendEnquiryEmail = async (details: MailDetails): Promise<boolean> => {
  const recipient = "villalemonhomestay@gmail.com";
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY || "bf05dfbf-c860-4fc5-bf88-32c25b1026c3";

  const interestedInStr = details.interestedIn && details.interestedIn.length > 0 
    ? details.interestedIn.join(", ") 
    : "None selected";

  // 1. Try sending via Web3Forms if access key is available
  if (web3FormsKey) {
    try {
      console.log(`[mailer]: Attempting to send enquiry email via Web3Forms for ${details.name}...`);
      const payload = {
        access_key: web3FormsKey,
        subject: `New Stay Enquiry from ${details.name}`,
        from_name: "Villa Lemon Enquiry",
        replyto: details.email,
        name: details.name,
        email: details.email,
        phone: details.phone,
        "WhatsApp Number": details.whatsappNumber || "N/A",
        country: details.country || "N/A",
        "Planning Date": details.planningDate || "N/A",
        "Flexible Dates": details.flexibleDates ? "Yes" : "No",
        "Adults": details.adults ?? 1,
        "Children": details.children ?? 0,
        "Duration of Stay": details.duration || "N/A",
        "Preferred Contact Method": details.preferredContact || "N/A",
        "Preferred Accommodation": details.preferredAccommodation || "No Preference",
        "How Found": details.howFound || "N/A",
        "Interested In": interestedInStr,
        message: details.message
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json() as { success: boolean; message?: string };
      if (response.ok && result.success) {
        console.log(`[mailer]: Email sent successfully via Web3Forms for ${details.name}`);
        return true;
      } else {
        console.error("[mailer]: Web3Forms submission returned failure status:", result);
      }
    } catch (err) {
      console.error("[mailer]: Failed sending via Web3Forms", err);
    }
  }

  // 2. Fallback to SMTP if SMTP config variables are set in .env
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn(
      `[mailer]: SMTP configuration is missing in .env (SMTP_HOST, SMTP_USER, SMTP_PASS) and Web3Forms was either not successful or not used. ` +
      `Skipping email notification. Logged enquiry details:`,
      JSON.stringify(details, null, 2)
    );
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eae6db; background-color: #fbf9f6; color: #121212;">
        <h2 style="font-family: Georgia, serif; color: #c5a880; border-bottom: 2px solid #c5a880; padding-bottom: 10px; margin-bottom: 20px; text-transform: uppercase; font-size: 18px; letter-spacing: 0.1em;">
          New Stay Enquiry - Villa Lemon
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eae6db; width: 180px;">Name</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eae6db;">${details.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eae6db;">Email</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eae6db;"><a href="mailto:${details.email}" style="color: #c5a880; text-decoration: none;">${details.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eae6db;">Phone / Mobile</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eae6db;">${details.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eae6db;">WhatsApp Number</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eae6db;">${details.whatsappNumber || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eae6db;">Country</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eae6db;">${details.country || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eae6db;">Planning to Visit</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eae6db;">${details.planningDate || "N/A"} ${details.flexibleDates ? "(Flexible Dates)" : ""}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eae6db;">Guests</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eae6db;">Adults: ${details.adults || 0} | Children: ${details.children || 0}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eae6db;">Duration of Stay</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eae6db;">${details.duration || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eae6db;">Preferred Contact Method</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eae6db;">${details.preferredContact || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eae6db;">Preferred Stay</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eae6db;">${details.preferredAccommodation || "No Preference"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eae6db;">How they found us</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eae6db;">${details.howFound || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #eae6db;">Interested In</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eae6db;">${interestedInStr}</td>
          </tr>
        </table>
        
        <div style="background-color: #fff; border: 1px solid #eae6db; padding: 15px; border-radius: 4px; margin-top: 20px;">
          <h4 style="margin-top: 0; margin-bottom: 10px; font-family: Georgia, serif; color: #121212;">Message:</h4>
          <p style="margin: 0; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${details.message}</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          ${details.whatsappNumber ? `
            <a href="https://wa.me/${details.whatsappNumber.replace(/[^0-9]/g, "")}" 
               style="background-color: #16a34a; color: white; padding: 12px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block; font-size: 13px; margin-right: 10px;">
               Chat on WhatsApp
            </a>
          ` : ""}
          <a href="mailto:${details.email}" 
             style="background-color: #121212; color: white; padding: 12px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block; font-size: 13px;">
            Reply to Email
          </a>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${details.name} (Villa Lemon Enquiry)" <${smtpUser}>`,
      to: recipient,
      replyTo: details.email,
      subject: `New Stay Enquiry from ${details.name}`,
      html: emailHtml,
    });

    console.log(`[mailer]: Email sent successfully to ${recipient} for ${details.name}`);
    return true;
  } catch (err) {
    console.error("[mailer]: Failed to send email via SMTP", err);
    return false;
  }
};
