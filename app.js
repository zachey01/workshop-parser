const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");

const userId = "76561199219730677"; // ID пользователя на Steam
const MainUrl = `https://steamcommunity.com/profiles/${userId}/myworkshopfiles/`; // URL страницы с работами пользователя

request(MainUrl, (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html); // загружаем HTML-код страницы в Cheerio
    const worksList = $(".workshopItem"); // находим список работ пользователя
    const worksData = []; // массив для хранения данных о работах

    worksList.each((index, element, link) => {
      const workTitle = $(element).find(".workshopItemTitle").text(); // название работы
      const workImg = $(".workshopItemPreviewImage").attr();
      const workId = $(".workshopItemPreviewHolder").attr();

      let workIdnum = workId.id.replace(/\D/g, "");

      // сохраняем данные о работе в объект и добавляем его в массив
      const workData = {
        title: workTitle,
        image: workImg.src,
        id: workIdnum,
      };
      worksData.push(workData);
    });

    // сохраняем массив с данными о работах в JSON-файл
    const jsonData = JSON.stringify(worksData);
    const fileName = "worksData.json";
    fs.writeFile(fileName, jsonData, (err) => {
      if (err) throw err;
      console.log(`Данные о работах пользователя сохранены в файл ${fileName}`);
    });
  }

  const workshopUrl = `https://steamcommunity.com/sharedfiles/filedetails/?id=${workIdnum}`; // URL страницы Steam Workshop для Dota 2

  request(workshopUrl, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html); // загружаем HTML-код страницы в Cheerio
      const worksData = []; // массив для хранения данных о работах

      worksList.each((index, element) => {
        const workAuthor = $(element).find(".workshopItemAuthorName a").text(); // автор работы
        const workDate = $(element).find(".workshopItemDate").text(); // дата добавления работы
        const workSubscribers = $(element).find(".numSubscriptions").text(); // количество подписчиков на работу

        // сохраняем данные о работе в объект и добавляем его в массив
        const workData = {
          title: workTitle,
          author: workAuthor,
          date: workDate,
          subscribers: workSubscribers,
        };
        worksData.push(workData);
      });

      // сохраняем массив с данными о работах в JSON-файл
      const jsonData = JSON.stringify(worksData);
      const fileName = "works1Data.json";
      fs.writeFile(fileName, jsonData, (err) => {
        if (err) throw err;
        console.log(
          `Данные о работах Steam Workshop сохранены в файл ${fileName}`
        );
      });
    }
  });
});
