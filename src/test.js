const axios = require("axios");


async function GET_LYRICS() {
    let track_id = "15953433";
    let apikey = "4c6c268c5ec5c4d7ac705f11e4c4bb45"; 
    let lyrics = await axios({
      method: 'get',
      url: 'https://api.musixmatch.com/ws/1.1/track.lyrics.get', 
      params: {
        track_id, apikey
      }
    });
    console.log(lyrics);
    return lyrics; 
  };

(async () => {await GET_LYRICS(); })();