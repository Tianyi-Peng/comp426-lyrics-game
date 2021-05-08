import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "bulma";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'

// To make this more appealing, we could use href and have links to other parts of the website
export default function AppFrame() {
  let [loginType, setLoginType] = useState(0); // 0 = None, 1 = Sign Up, 2 = Log In
  let [name, setName] = useState(""); 
  let [password, setPassword] = useState(""); // Maybe create a special update call that doesn't require the password
  let [isLight, setIsLight] = useState(true); // Get from user preferences, default is true
  let [showHint, setShowHint] = useState(false); 
  let [next, setNext] = useState(false); 
  let [over, setOver] = useState(false);
  let [highScore, setHighScore] = useState(0); 
  let [correct, setCorrect] = useState(0); 
  let [total, setTotal] = useState(0); 
  let [currentSong, setCurrentSong] = useState("Loading..."); // Reset to this
  let [currentTitle, setCurrentTitle] = useState("currentTitle"); 
  let [hideSong, setHideSong] = useState(false); 
  let [currentSongHint, setCurrentSongHint] = useState(""); 
  let [choices, setChoices] = useState([]); 
  let [correctChoice, setCorrectChoice] = useState(0); 

  useEffect(() => {
    let resetChoices = () => {
      setCurrentSong("Loading...");
      setChoices([]); 
      setCurrentTitle(""); 
      if(over){
        setCorrect(0);
        setTotal(0);
        setOver(false); 
      }
    }

    let getChoices = async () => { 
      let tries = 10;
      // Fill the array of choices
      let arr = []; 
      for(let i = 0; i < 4; i++){
        let s = undefined; 
        for(let j = 0; s === undefined && j < tries; j++){ // Number of times we'll retry (+1) if we don't get a valid song
          s = await GET_SONG();
        }
        if(s === undefined){
          s = {track_id: "15953433", track_name: "Somebody That I Used to Know", artist_name: "Gotye"}; 
        }
        arr.push(s); 
      }

      // Pick a song that has lyrics
      let choice = Math.floor(Math.random()*4); 
      for(let j = 0; (arr[choice] === undefined || !arr[choice].has_lyrics) && j < tries; j++){
        arr[choice] = await GET_SONG();
      }
      if(arr[choice] === undefined || !arr[choice].has_lyrics){
        arr[choice] = {track_id: "15953433", track_name: "Somebody That I Used to Know", artist_name: "Gotye"}; 
      }

      let lyrics = await GET_LYRICS(arr[choice].track_id); 
      setCorrectChoice(choice); // setCorrectChoice does not update correctChoice immediately
      setCurrentTitle(arr[choice].track_name);
      setCurrentSong(lyrics.slice(0, lyrics.indexOf("\n\n"))); 
      setCurrentSongHint(lyrics.slice(lyrics.indexOf("\n\n") + 1));
      setHideSong(true);
      
      arr = arr.map(song => "\"" + song.track_name + "\" by " + song.artist_name); 
      setChoices(arr);
    };
    if(!next){resetChoices(); getChoices();}
  }, [next]);

  useEffect(async () => {
    if(next){
      setTotal(total + 1);
      if(correct > highScore){
        setHighScore(correct);
        if(name != ""){
          UPDATE_USER(name, password, isLight, highScore); 
        }
      }
    }
  }, [next]); 

  return (
    <div>
      <section class={"hero is-fullheight " + (isLight ? "is-white" : "is-black")}>
        <div class="hero-head">
          <nav class="navbar">
            <div class="container">
              <div class="navbar-brand">
                <a class="navbar-item">
                  <p class="is-size-3">Lyrics Trainer</p>
                </a>
              </div>
              <div class="navbar-menu">
                <div class="navbar-end">
                  <a class="navbar-item" onClick={() => {CREATE_TWEET(name, highScore)}}>
                    <div class="content">
                      <p class="heading has-text-primary m-0">High Score</p>
                      <p class="title has-text-primary">{highScore}</p>
                    </div>
                  </a>
                  <a class="navbar-item" onClick={() => {setIsLight(!isLight); name != "" && UPDATE_USER(name, password, !isLight, highScore);}}>
                    <span class="icon is-medium">
                      <FontAwesomeIcon icon={faSun} />
                    </span>
                  </a>
                  <span class="navbar-item">
                    {name == "" &&
                    <button class={"button is-outlined " + (isLight ? "is-black" : "is-white")} onClick={() => {setLoginType(1)}}>
                      <span>Sign Up</span>
                    </button>}
                    {name != "" &&
                    <div class="content">
                      <p class="heading has-text-primary m-0">Welcome</p>
                      <p class="title has-text-primary">{name}</p>
                    </div>}
                  </span>
                  <span class="navbar-item">
                    {name == "" &&
                    <button class={"button is-outlined " + (isLight ? "is-black" : "is-white")}  onClick={() => {setLoginType(2)}}>
                      <span>Log In</span>
                    </button>}
                    {name != "" &&
                    <button class={"button is-outlined " + (isLight ? "is-black" : "is-white")} onClick={() => {setName(""); setPassword("");}}>
                      <span>Log Out</span>
                    </button>}
                  </span>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div class="hero-body">
          <div class="container has-text-centered">
            <LyricsFrame currentSong={currentSong} currentSongHint={currentSongHint} currentTitle={currentTitle} showHint={showHint} hideSong={hideSong}/>
            <QuestionsFrame choice={choices[0]} correctChoice={correctChoice === 0} next={next} setNext={setNext} correct={correct} setCorrect={setCorrect} setHideSong={setHideSong} setOver={setOver}/>
            <QuestionsFrame choice={choices[1]} correctChoice={correctChoice === 1} next={next} setNext={setNext} correct={correct} setCorrect={setCorrect} setHideSong={setHideSong} setOver={setOver}/>
            <QuestionsFrame choice={choices[2]} correctChoice={correctChoice === 2} next={next} setNext={setNext} correct={correct} setCorrect={setCorrect} setHideSong={setHideSong} setOver={setOver}/>
            <QuestionsFrame choice={choices[3]} correctChoice={correctChoice === 3} next={next} setNext={setNext} correct={correct} setCorrect={setCorrect} setHideSong={setHideSong} setOver={setOver}/>
            
            <div class="columns is-centered">
              <div class="column is-one-third">
                <nav class="level">
                  <div class="level-item">
                    <button class="button is-outlined is-info" disabled={showHint ? "disabled" : ""} onClick={() => setShowHint(true)}> 
                      <span>Get Hint</span>
                    </button>
                  </div>
                  <div class="level-item">
                    <div class="content">
                      <p class="heading has-text-primary m-0">Correct</p>
                      <p class="title has-text-primary">{correct} / {total}</p>
                    </div>
                  </div>
                  <div class="level-item">
                    <button class="button is-outlined is-info" onClick={() => {setCorrect(0); setTotal(0);}}>
                      <span>Reset</span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>
            
            <button class="button is-outlined is-primary" style={{visibility: next ? "" : "hidden"}} onClick={() => {setShowHint(false); setNext(false);}}>
              <span>{over ? "Try Again" : "Next Song"}</span> 
            </button>
          </div>
        </div>
        {loginType && <SignIn loginType={loginType} setLoginType={setLoginType} isLight={isLight} setIsLight={setIsLight} highScore={highScore} setHighScore={setHighScore} setName={setName} setPassword={setPassword}/>}
      </section>
    </div>
  );
}

function LyricsFrame({currentSong, currentSongHint, currentTitle, showHint, hideSong}){
  if(hideSong){
    let reg = new RegExp(currentTitle, 'gi');
    for(let s of currentSong.matchAll(reg)){ // This won't loop infinitely if the song title is ./../..., though the ellipses will look strange
      currentSong = currentSong.replaceAll(s, "..."); 
    }
  }
  
  return (
    <div class="tile is-ancestor">
      <div class="tile is-vertical">
        <article class="tile is-child">
          <div class="content" style={{whiteSpace: "pre-wrap"}}>
            {currentSong}
            <br/>
            {showHint && currentSongHint}
          </div>
        </article>
      </div>
    </div>
  ); 
}

function QuestionsFrame({choice, correctChoice, next, setNext, correct, setCorrect, setHideSong, setOver}){
  let [selected, setSelected] = useState(false); 

  useEffect(() => {
    if(!next){
      setSelected(false); 
    }
  }, [next]);
  
  return (
    <button class={"button is-fullwidth m-4 " + (next ? (correctChoice ? "is-success" : (selected ? "is-danger" : "is-outlined is-primary")) : "is-outlined is-primary")} 
    onClick={() => {setNext(true); setHideSong(false); !next && setSelected(true); correctChoice ? setCorrect(correct + 1) : setOver(true);}}>
      <span>{choice}</span>
    </button>
  ); 
}

export function SignIn({loginType, setLoginType, isLight, setIsLight, highScore, setHighScore, setName, setPassword}){ 
  let [usernameInput, setUsernameInput] = useState(""); 
  let [passwordInput, setPasswordInput] = useState(""); 
  let [error, setError] = useState(""); 

  let login = async () => {
    if(usernameInput == "" || passwordInput == ""){
      setError("Fill in both fields");
    }
    else if(loginType === 1){
      let result = await CREATE_USER(usernameInput, passwordInput, isLight, highScore); 
      if(result){
        setLoginType(0);
        setError(""); 
        setName(usernameInput);
        setPassword(passwordInput); 
      }
      else{
        setError("Username has already been taken");
      }
    }
    else if(loginType === 2){
      let result = await VERIFY_USER(usernameInput, passwordInput); 
      if(result){
        let user = await GET_USER(usernameInput); 
        setLoginType(0);
        setError(""); 
        setName(usernameInput);
        setPassword(passwordInput);
        setIsLight(user.brightness); 
        setHighScore(user.highScore); 
      }
      else{
        setError("Incorrect username or password");
      }      
    }
  }; 

  return (
    <div class="modal is-clipped is-active">
      <div class="modal-background" onClick={() => {setLoginType(0)}}>
        <button class="modal-close is-large" aria-label="close"></button>
      </div>
      <div class="modal-content">
        <div class="box">
          <div class="field">
            <p class="is-size-4">{loginType === 1 ? "Sign Up" : loginType === 2 ? "Log In" : ""}</p>
          </div>
          <div class="field">
            <input class="input" type="text" placeholder="Username" onInput={e => setUsernameInput(e.target.value)}/>
          </div>
          <div class="field">
            <input class="input" type="text" placeholder="Password" onInput={e => setPasswordInput(e.target.value)}/>
          </div>
          {error !== "" && <span class={"tag is-light is-medium " + (error == "Processing..." ? "is-info" : "is-danger")}>{error}</span>}
          <div class="level-item">
            <button class="button is-info is-fullwidth" onClick={() => {setError("Processing..."); login();}}>Submit</button> 
          </div>
        </div>
      </div>
    </div>
  ); 
}

async function GET_SONG() {
  let track_id = Math.floor(Math.random() * 6000000); 
  let apikey = "4c6c268c5ec5c4d7ac705f11e4c4bb45"; 
  let song = await axios({
    method: 'get',
    url: 'https://gn7ugp7bo0.execute-api.us-east-1.amazonaws.com/Prod//ws/1.1/track.get', 
    params: {
      track_id, apikey
    }
  });
  return song.data.message.body.track; 
};

async function GET_LYRICS(track_id) {
  let apikey = "4c6c268c5ec5c4d7ac705f11e4c4bb45"; 
  let lyrics = await axios({
    method: 'get',
    url: 'https://gn7ugp7bo0.execute-api.us-east-1.amazonaws.com/Prod//ws/1.1/track.lyrics.get', 
    params: {
      track_id, apikey
    }
  });
  return lyrics.data.message.body.lyrics.lyrics_body.split('...', 1)[0]; 
};

async function GET_USER(user) {
  let result = await axios({
    method: 'get',
    url: `https://gn7ugp7bo0.execute-api.us-east-1.amazonaws.com/Prod/GetUser/${user}`
  });
  return result.data; // {brightness: boolean, highScore: int, username: string}
};

async function CREATE_USER(u, p, b, h) {
  let result = await axios({
    method: 'post',
    url: 'https://gn7ugp7bo0.execute-api.us-east-1.amazonaws.com/Prod/CreateUser', 
    data: {
      username: u,
      password: p,
      brightness: b,
      highScore: h
    }, 
    headers: {
      'Content-Type': 'text/plain',
    }
  });
  return result.data.success; 
};

async function VERIFY_USER(u, p) {
  let result = await axios({
    method: 'post',
    url: 'https://gn7ugp7bo0.execute-api.us-east-1.amazonaws.com/Prod/VerifyUser', 
    data: {
      username: u,
      password: p
    },
    headers: {
      'Content-Type': 'text/plain',
    }
  });
  return result.data.success; 
};

async function UPDATE_USER(u, p, b, h) {
  let result = await axios({
    method: 'post',
    url: 'https://gn7ugp7bo0.execute-api.us-east-1.amazonaws.com/Prod/UpdateUser', 
    data: {
      username: u,
      password: p,
      brightness: b,
      highScore: h
    },
    headers: {
      'Content-Type': 'text/plain',
    }
  });
  return result.data.success; 
};

async function CREATE_TWEET(user, score) {
  let _body = user + " has gotten " + score + " songs correct in a row!";
  let createdTweet = await axios({
      method: 'post',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
      data: {body: _body}, 
      withCredentials: true
  });
  return createdTweet; 
};
