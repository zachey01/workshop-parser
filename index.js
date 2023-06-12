const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");

function workshopparser(userId, fileName) {
  const MainUrl = `https://steamcommunity.com/profiles/${userId}/myworkshopfiles/`; // URL страницы с работами пользователя

  request(MainUrl, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html); // загружаем HTML-код страницы в Cheerio
      const worksList = $(".workshopItem"); // находим список работ пользователя
      const worksData = []; // массив для хранения данных о работах

      worksList.each((index, element, link) => {
        const workTitle = $(element).find(".workshopItemTitle").text(); // название работы
        const workImg = $(element)
          .find(".workshopItemPreviewImage")
          .attr("src");
        const workId = $(".workshopItemPreviewHolder").attr();

        let workIdnum = workId.id.replace(/\D/g, "");

        // сохраняем данные о работе в объект и добавляем его в массив
        const workData = {
          title: workTitle,
          image: workImg,
          id: workIdnum,
        };
        if (workImg) {
          worksData.push(workData);
        }
      });

      // сохраняем массив с данными о работах в JSON-файл
      const jsonData = JSON.stringify(worksData);

      fs.writeFile(fileName, jsonData, (err) => {
        if (err) throw err;
      });
    }
  });
}
module.exports = workshopparser;
