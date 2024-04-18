const port = process.env.PORT || 3000;
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const twilio = require("twilio");
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("I am alive");
});

const accountSidOTP = process.env.ACCOUNT_SID_OTP;
const authTokenOTP = process.env.AUTH_TOKEN_OTP;
const serviceSidOTP = process.env.SERVICE_SID;
// Twilio Credentials
const accountSid = process.env.CALLACCOUNT_SID;
const authToken = process.env.CALLAUTH_TOKEN;

app.post("/send-otp", async (req, res) => {
    const client = twilio(accountSidOTP, authTokenOTP);
    const { phoneNumber } = req.body;
    console.log("reached");
    try {
        const verification = await client.verify
            .services(serviceSidOTP)
            .verifications.create({ to: phoneNumber, channel: "sms" });
        console.log(`OTP sent to ${phoneNumber}: ${verification.sid}`);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/verify-otp", async (req, res) => {
    const client = twilio(accountSidOTP, authTokenOTP);
    const { phoneNumber, code } = req.body;

    try {
        const verificationCheck = await client.verify
            .services(serviceSidOTP)
            .verificationChecks.create({ to: phoneNumber, code: code });
        if (verificationCheck.status === "approved") {
            console.log("OTP verified successfully");
            res.status(200).json({ message: "OTP verified successfully" });
        } else {
            console.log("Invalid OTP");
            res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "Failed to verify OTP" });
    }
});
app.post("/initiate-call", async (req, res) => {
    const twilioClient = twilio(accountSid, authToken);
    const { to } = req.body;
    try {
        const call = await twilioClient.calls.create({
            url: process.env.SERVER + "calls/conference-call", // URL to fetch TwiML instructions
            to,
            from: "+12512998076", // Your Twilio phone number
        });
        console.log(`Call initiated: ${call.sid}`);
        res.status(200).json({ message: "Call initiated successfully" });
    } catch (error) {
        console.error("Error initiating call:", error);
        res.status(500).json({ error: "Failed to initiate call" });
    }
});
app.post("/calls/conference-call", (req, res) => {
    console.log("Request recieved");
    const twimlResponse = new twilio.twiml.VoiceResponse();
    const dial = twimlResponse.dial({ record: true });
    dial.number(
        {
            statusCallbackEvent: "initiated ringing answered completed",
            statusCallbackMethod: "POST",
        },
        "+918976788430"
    );
    res.type("text/xml");
    res.send(twimlResponse.toString());
});
const server = () => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`Server running on port ${port}`);
    });
    console.log(serviceSidOTP);
    console.log("Testing app running on port 30");
};

server();
