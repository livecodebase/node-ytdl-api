const { Router } = require("express");
const router = Router();

const fs = require('fs');
const ytdl = require('ytdl-core');
const fakeData = require('../data.json')


router.get("/", async (req, res) => {
  // console.log('info')
  try {
    // let url = 'https://www.youtube.com/shorts/J16oF508C_4'
    // let metaData = await ytdl.getBasicInfo(url)
    let v_formats = []
    fakeData.forEach(format => {
      let data = {
        is_audio: false,
        audible: false
      }

      // mimeType
      let fsplit = format.mimeType.split(';')
      if (fsplit[0].includes("audio")) {
        data.is_audio = true
      }

      // Is Audible
      if (format.audioQuality) {
        data.audible = true
      }

      // v_formats.push(data)
    })
    
    return res.status(200).send({ message: "Helllo World" });
    
  } catch (error) {
    return res.status(200).send({ message: "Helllo World" });
  }
});


module.exports = router;
