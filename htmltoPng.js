const { MessageAttachment } = require("discord.js");
const puppeteer = require("puppeteer");

module.exports = async (msg, user, data) => {
  const getWidth = (num) => {
    if (num > 99 && num !== 10) {
      return +(num + "").slice(-2);
    } else {
      return num;
    }
  };

  const htmlString = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <style>
        #header,
        #footer {
          padding: 0 !important;
          margin: 0 !important;
        }
  
        h2 {
          font-size: 15px;
        }
  
        h4 {
          font-size: 10px;
        }
  
        h2,
        h4 {
          height: fit-content !important;
          margin: 0 !important;
          font-weight: 500;
        }
  
        body {
          font-family: "Poppins", Arial, Helvetica, sans-serif;
          background: rgb(22, 22, 22);
          color: #fff;
          max-width: 320px;
          padding: 0 !important;
          margin: 0 !important;
        }
  
        .app {
          padding: 10px 0 0 2px;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          border-top: 3px solid rgb(16, 180, 209);
          background: rgb(31, 31, 31);
        }
  
        .app_pfp {
          display: flex;
          align-items: flex-end;
          padding-left: 5px;
        }
  
        .app_xpLevel {
          width: 100%;
          margin-left: auto;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        }
        .app_xpLevel h2 {
          color: #0cb3f0;
          padding-left: 3px;
          font-weight: 100;
          padding-right: 5px;
        }
  
        .app-pfp_text h4 {
          font-size: 16px !important;
        }
  
        #progressbar {
          background-color: black;
          border-radius: 13px;
          padding: 3px;
          width: 180px;
        }
  
        #progressbar > div {
          background-color: #0cb3f0;
          width: ${getWidth(data.xp)}%;
          height: 20px;
          border-radius: 10px;
        }
  
        img {
          width: 50px;
          height: 50px;
          margin-right: 20px;
          border-radius: 50%;
          border: 1px solid #fff;
          padding: 5px;
        }
      </style>
    </head>
    <body>
      <div class="app">
        <div class="app_xpLevel">
          <h4>XP</h4>
          <h2>${data.xp}</h2>
        </div>
  
        <div class="app_pfp">
          <div class="app-pfp_image">
            <img src="${user.avatarURL()}" />
          </div>
  
          <div class="app-pfp_text">
            <h4>${user.username}</h4>
            <div class="app-pfp_fill">
              <div id="progressbar">
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>`;

  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 310,
    height: 120,
    deviceScaleFactor: 2,
  });
  await page.setContent(htmlString);
  let screenshot = await page.screenshot();
  await browser.close();

  msg.channel.send(new MessageAttachment(screenshot, `${user.username}.jpg`));
};
