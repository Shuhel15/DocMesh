import transporter from "@/lib/mailer";

export async function sendOTPEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Verify your DocMesh account",

    text: `Your DocMesh verification OTP is ${otp}. This OTP will expire in 10 minutes.`,

    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify your DocMesh account</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
            font-family: Arial, Helvetica, sans-serif;
            color: #18181b;
          "
        >
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="background-color: #f4f4f5; padding: 40px 16px;"
          >
            <tr>
              <td align="center">

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    max-width: 520px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #e4e4e7;
                  "
                >

                  <!-- Header -->
                  <tr>
                    <td
                      style="
                        padding: 28px 32px;
                        text-align: center;
                        border-bottom: 1px solid #e4e4e7;
                      "
                    >
                      <div
                        style="
                          font-size: 26px;
                          font-weight: 700;
                          color: #18181b;
                        "
                      >
                        DocMesh
                      </div>

                      <div
                        style="
                          margin-top: 6px;
                          font-size: 13px;
                          color: #71717a;
                        "
                      >
                        AI-powered knowledge &amp; RAG platform
                      </div>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 36px 32px;">

                      <h1
                        style="
                          margin: 0 0 14px;
                          font-size: 24px;
                          line-height: 1.3;
                          color: #18181b;
                          text-align: center;
                        "
                      >
                        Verify your email
                      </h1>

                      <p
                        style="
                          margin: 0 0 28px;
                          font-size: 15px;
                          line-height: 1.6;
                          color: #52525b;
                          text-align: center;
                        "
                      >
                        Thanks for creating a DocMesh account.
                        Use the verification code below to verify your email address.
                      </p>

                      <!-- OTP -->
                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                      >
                        <tr>
                          <td align="center">

                            <div
                              style="
                                display: inline-block;
                                padding: 16px 28px;
                                background-color: #f4f4f5;
                                border: 1px solid #d4d4d8;
                                border-radius: 10px;
                                font-size: 32px;
                                font-weight: 700;
                                letter-spacing: 8px;
                                color: #18181b;
                              "
                            >
                              ${otp}
                            </div>

                          </td>
                        </tr>
                      </table>

                      <p
                        style="
                          margin: 22px 0 0;
                          text-align: center;
                          font-size: 13px;
                          color: #71717a;
                        "
                      >
                        This OTP will expire in <strong>10 minutes</strong>.
                      </p>

                      <p
                        style="
                          margin: 28px 0 0;
                          font-size: 14px;
                          line-height: 1.6;
                          color: #52525b;
                        "
                      >
                        If you didn't create a DocMesh account, you can safely
                        ignore this email.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td
                      style="
                        padding: 20px 32px;
                        background-color: #fafafa;
                        border-top: 1px solid #e4e4e7;
                        text-align: center;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          font-size: 12px;
                          color: #a1a1aa;
                        "
                      >
                        © ${new Date().getFullYear()} DocMesh. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}