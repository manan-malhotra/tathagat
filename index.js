const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 3001;

const accountSidOTP = process.env.ACCOUNT_SID_OTP;
const authTokenOTP = process.env.AUTH_TOKEN_OTP;
const serviceSidOTP = process.env.SERVICE_SID;
app.get("/", (req, res) => {
    res.status(200).json({ message: "Hi" });
});
// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });

const server = () => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
    console.log(serviceSidOTP);
    console.log("Testing app running on port 3001");
};

server();
