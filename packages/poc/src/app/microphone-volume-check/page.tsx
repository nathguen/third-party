"use client";

import { Button, ThemeProvider, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import theme from "../theme";

export default function MicrophoneVolumeCheck() {
  const recorder = useRef<RecordRTC | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const [transcript, setTranscript] = useState<string>("");

  const [isRecording, setIsRecording] = useState<boolean>(false);

  const hasMagicPhrase = useMemo(() => {
    if (!transcript) return false;

    return (
      transcript.toLowerCase().includes("hello") &&
      transcript.toLowerCase().includes("friend")
    );
  }, [transcript]);

  const startRecording = useCallback(async () => {
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
    socket.current = await new WebSocket(
      `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
    );

    // handle incoming messages to display transcription to the DOM
    const texts: {
      [key: string]: string;
    } = {};
    socket.current.onmessage = (message) => {
      // if (!messageEl.current) return;

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

      setTranscript(`${transcript} ${msg}`);
    };

    socket.current.onerror = (event) => {
      console.error(event);

      if (socket.current) socket.current.close();
    };

    socket.current.onclose = (event) => {
      console.log(event);
      socket.current = null;
    };

    socket.current.onopen = () => {
      // if (!messageEl.current) return;

      // once socket is open, begin recording
      // messageEl.current.style.display = "";
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          recorder.current = new RecordRTC(stream, {
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
                if (socket.current) {
                  socket.current.send(
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

          recorder.current.startRecording();
        })
        .catch((err) => console.error(err));
    };
  }, []);

  const stopRecording = useCallback(async () => {
    if (socket.current) {
      socket.current.send(JSON.stringify({ terminate_session: true }));
      socket.current.close();
      socket.current = null;
    }

    if (recorder.current) {
      recorder.current.pauseRecording();
      recorder.current = null;
    }
  }, []);

  useEffect(() => {
    startRecording();
  }, [startRecording]);

  useEffect(() => {
    // turn off
    stopRecording();
  }, [hasMagicPhrase, stopRecording]);

  return (
    <ThemeProvider theme={theme}>
      <main className="flex flex-1 flex-col items-center justify-center p-4 gap-4">
        <Typography variant="h2">Mic Check</Typography>

        <Typography variant="body1" align="center">
          Let&apos;s see if I can hear you!
        </Typography>

        <Typography variant="h4" align="center">
          Try saying <br />
          &quot;Hello, Friend!&quot;
        </Typography>
        <p>{transcript}</p>

        <Button variant="contained" disabled={!hasMagicPhrase}>
          <Typography variant="h6">Continue</Typography>
        </Button>
      </main>
    </ThemeProvider>
  );
}
