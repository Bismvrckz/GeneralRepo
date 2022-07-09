const express = require("express");
const router = express.Router();
const pool = require("../../lib/database");
const { verifyToken } = require("../../lib/token");

const getUser = async (req, res) => {
  try {
    const { userName, email } = req.query;
    const connection = pool.promise();
    let arizonnaGetUser;
    switch (userName) {
      case undefined:
        arizonnaGetUser = `SELECT * FROM users WHERE email = '${email}';`;

        break;

      default:
        arizonnaGetUser = `SELECT * FROM users WHERE username = '${userName}';`;
        break;
    }

    const [getUserResult] = await connection.query(arizonnaGetUser);

    res.send({
      result: getUserResult,
    });
  } catch (error) {
    res.send({ error });
  }
};

const userVerificationHandler = async (req, res, next) => {
  try {
    const { token } = req.params;

    const verifiedToken = verifyToken(token);

    const { username, user_id } = verifiedToken;

    const connection = pool.promise();
    const updateUserIsVerifiedStatus = `UPDATE USERS SET ? where USER_ID  = ?`;
    const updateUserIsVerifiedStatusData = [{ isVerified: true }, user_id];

    const [resUpdateUserIsVerifiedStatus] = await connection.query(
      updateUserIsVerifiedStatus,
      updateUserIsVerifiedStatusData
    );

    if (!resUpdateUserIsVerifiedStatus.affectedRows)
      throw { message: "Failed user verification" };

    res.send(`<!DOCTYPE html>
      <html lang="en">
        <head>
        <link rel="icon" type="image/png" href="https://wac-cdn-2.atlassian.com/image/upload/f_auto,q_auto/assets/img/favicons/atlassian/favicon.png" sizes="32x32"/>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Arizonna</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
          <script
            src="https://kit.fontawesome.com/880ed11170.js"
            crossorigin="anonymous"
          ></script>
        </head>
        <body
          class="relative font-[Montserrat] flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 to-green-800 text-white h-[100vh] w-[100vw]"
        >
          <div class="flex w-[80%] h-[90%] flex-col pt-[3vh]">
            <div class="flex items-center w-[100%] mt-[10vh]">
              <i class="fa-brands fa-atlassian text-cyan-400 text-[6vh]"></i>
              <p class="text-[6vh]"> Arizonna</p>
            </div>
            <p>
              <p class="font-[600] text-[2rem]">Hi, ${username}</p> <br />
                  Welcome to arizonna,<br />
                  Your email is verified
            </p>
      
            <a href="http://localhost:3000" target="_blank"
              class="bg-blue-500 flex items-center justify-center h-[3rem] my-[1vh] w-[15vw] text-[1.2rem] rounded-[1vh]"
            >
              Continue to Arizonna
          </a>
            <p class="text-[2rem]">Thank you for joining arizonna</p>
          </div>
          <div
            class="bg-black opacity-[.4] -z-[1] h-[90%] w-[90%] absolute rounded-[1vh]"
          >
            <p class="opacity-0"></p>
          </div>
        </body>
      </html>`);
  } catch (error) {
    console.log({ error });
  }
};

router.get("/", getUser);
router.get("/verify/:token", userVerificationHandler);

module.exports = router;
