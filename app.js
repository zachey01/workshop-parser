const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");

function workshop_parser() {
const MainUrl = `https://steamcommunity.com/profiles/${userId}/myworkshopfiles/`; // URL of the user artwork page

request(MainUrl, (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html); // load the HTML code of the page into Cheerio
    const worksList = $(".workshopItem"); // find the user's job list
    const worksData = []; // array for storing data about works

    worksList.each((index, element, link) => {
      const workTitle = $(element).find(".workshopItemTitle").text(); // job name
      const workImg = $('.workshopItemPreviewImage').attr();
      const workId = $('.workshopItemPreviewHolder').attr();

      let workIdnum = workId.id.replace(/\D/g,'')
      
      
      // save the job data to an object and add it to an array
      const workData = {
        title: workTitle,
        image: workImg.src,
        id: workIdnum,
      };
      worksData.push(workData);
    });

    // save an array of job data in a JSON file
    const jsonData = JSON.stringify(worksData);
    const fileName = "worksData.json";
    fs.writeFile(fileName, jsonData, (err) => {
    });
  }
});
}