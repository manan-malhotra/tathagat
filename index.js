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
        res.status(500).json({ error: "Failed to send OTP" });
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

const server = () => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`Server running on port ${port}`);
    });
    console.log(serviceSidOTP);
    console.log("Testing app running on port 30");
};

server();
