const { Router } = require("express");
const router = Router();

const fs = require('fs');
const ytdl = require('ytdl-core');
// const fakeData = require('../data.json')


router.post("/", async (req, res) => {
  // console.log('info')
  try {
    let url = req.body.url
    let metaData = await ytdl.getBasicInfo(url)

    // Local download video
    // await new Promise((resolve) => { // wait
    //   ytdl(url)
    //   .pipe(fs.createWriteStream('video.mp4'))
    //   .on('close', () => {
    //     resolve(); // finish
    //   })
    // })

    // let v_formats = []
    // fakeData.forEach(format => {
    //   let data = {
    //     is_audio: false,
    //     audible: false
    //   }

    //   // mimeType
    //   let fsplit = format.mimeType.split(';')
    //   if (fsplit[0].includes("audio")) {
    //     data.is_audio = true
    //   }

    //   // Is Audible
    //   if (format.audioQuality) {
    //     data.audible = true
    //   }

    //   // v_formats.push(data)
    // })
    
    return res.status(200).send({ meta: metaData });
    
  } catch (error) {
    return res.status(200).send({ message: "Helllo World" });
  }
});


module.exports = router;
