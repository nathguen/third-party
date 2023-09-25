"use client";

import { Button, Typography } from "@mui/material";
import { useRef, useState } from "react";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import Runtime, { RuntimeContextProvider, useRuntimeContext } from "./runtime";

function NewSession() {
  const messageEl = useRef<HTMLDivElement>(null);

  const { onStart, onPause, onReset, isRunning } = useRuntimeContext();

  const [isRecording, setIsRecording] = useState<boolean>(false);

  // set initial state of application variables
  // messageEl.style.display = "none";
  // let isRecording = false;
  let socket: WebSocket | null;
  let recorder: RecordRTC | null = null;

  // runs real-time transcription and handles global variables
  const run = async () => {
    if (!messageEl.current) return;

    if (isRecording) {
      if (socket) {
        socket.send(JSON.stringify({ terminate_session: true }));
        socket.close();
        socket = null;
      }

      if (recorder) {
        recorder.pauseRecording();
        recorder = null;
      }
    } else {
      const response = await fetch("http://localhost:8000/realtime-listener"); // get temp session token from server.js (backend)
      const data = await response.json();

      if (data.error) {
        alert(data.error);
      }

      const { token } = data;
      if (!token) {
        console.log("No token received");
        return;
      }

      // establish wss with AssemblyAI (AAI) at 16000 sample rate
      socket = await new WebSocket(
        `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
      );

      // handle incoming messages to display transcription to the DOM
      const texts: {
        [key: string]: string;
      } = {};
      socket.onmessage = (message) => {
        if (!messageEl.current) return;

        let msg = "";
        const res = JSON.parse(message.data);
        texts[res.audio_start] = res.text;
        const keys = Object.keys(texts);
        // @ts-ignore
        keys.sort((a, b) => a - b);
        for (const key of keys) {
          if (texts[key]) {
            msg += ` ${texts[key]}`;
          }
        }

        messageEl.current.innerText = msg;
      };

      socket.onerror = (event) => {
        console.error(event);

        if (socket) socket.close();
      };

      socket.onclose = (event) => {
        console.log(event);
        socket = null;
      };

      socket.onopen = () => {
        if (!messageEl.current) return;

        // once socket is open, begin recording
        messageEl.current.style.display = "";
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            recorder = new RecordRTC(stream, {
              type: "audio",
              mimeType: "audio/webm;codecs=pcm", // endpoint requires 16bit PCM audio
              recorderType: StereoAudioRecorder,
              timeSlice: 250, // set 250 ms intervals of data that sends to AAI
              desiredSampRate: 16000,
              numberOfAudioChannels: 1, // real-time requires only one channel
              bufferSize: 16384,
              audioBitsPerSecond: 128000,
              ondataavailable: (blob) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const base64data = reader.result;

                  if (!base64data) return;

                  // audio data must be sent as a base64 encoded string
                  if (socket) {
                    socket.send(
                      JSON.stringify({
                        // @ts-ignore
                        audio_data: base64data.split("base64,")[1],
                      })
                    );
                  }
                };
                reader.readAsDataURL(blob);
              },
            });

            recorder.startRecording();
          })
          .catch((err) => console.error(err));
      };
    }

    setIsRecording(!isRecording);
    // isRecording = !isRecording;
    // buttonEl.innerText = isRecording ? "Stop" : "Record";
    // titleEl.innerText = isRecording
    //   ? "Click stop to end recording!"
    //   : "Click start to begin recording!";
  };

  return (
    <div>
      <Runtime />

      {/* <Button disabled={isRunning} onClick={onStart}>
        Start
      </Button>
      <Button disabled={!isRunning} onClick={onPause}>
        Pause
      </Button>
      <Button onClick={onReset}>Reset</Button> */}

      <Button onClick={run}>{isRecording ? "Stop" : "Start"}</Button>

      <Typography variant="h4">Transcription</Typography>
      <p>Click start to begin recording!</p>

      <p ref={messageEl}></p>
    </div>
  );
}

export default function NewSessionPage() {
  return (
    <RuntimeContextProvider>
      <NewSession />
    </RuntimeContextProvider>
  );
}
