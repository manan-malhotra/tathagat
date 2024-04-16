const port = process.env.PORT || 3000;
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("I am alive");
});

const accountSidOTP = process.env.ACCOUNT_SID_OTP;
const authTokenOTP = process.env.AUTH_TOKEN_OTP;
const serviceSidOTP = process.env.SERVICE_SID;

// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });

const server = () => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`Server running on port ${port}`);
    });
    console.log(serviceSidOTP);
    console.log("Testing app running on port 30");
};

server();
