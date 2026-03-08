import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "./Camera.css";

const Camera = forwardRef(function Camera({ onRecordingComplete, externalControls = false }, ref) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [cameraReady, setCameraReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    function handleVisibilityChange() {
      console.log("[Camera] visibilitychange:", document.visibilityState, "MediaRecorder state:", mediaRecorderRef.current?.state);
      if (document.visibilityState === "hidden" && mediaRecorderRef.current?.state === "recording") {
        console.log("[Camera] tab hidden while recording -> stopping");
        stopRecording();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraReady(true);
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.");
      console.error("Camera error:", err);
    }
  }

  function stopCamera() {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      console.log("[Camera] stopCamera: stopping", tracks.length, "tracks");
      tracks.forEach((track) => {
        console.log("[Camera] stopping track:", track.kind, track.readyState);
        track.stop();
      });
      if (videoRef.current) videoRef.current.srcObject = null;
    }
  }

  function startRecording() {
    const stream = videoRef.current.srcObject;
    if (!stream) {
      console.warn("[Camera] startRecording called but no media stream is attached");
      return;
    }
    chunksRef.current = [];

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      console.log("[Camera] MediaRecorder onstop fired");
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      if (onRecordingComplete) onRecordingComplete(blob, url);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000);
    setRecording(true);
  }

  function stopRecording() {
    const mr = mediaRecorderRef.current;
    console.log("[Camera] stopRecording called, MediaRecorder state:", mr?.state);
    if (mr?.state === "recording") {
      mr.stop();
      setRecording(false);
    }
  }

  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording,
    isRecording: () => mediaRecorderRef.current?.state === "recording",
    isReady: cameraReady,
  }), [cameraReady]);

  if (error) {
    return (
      <div className="camera-block__error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="camera-block">
      <video
        ref={videoRef}
        muted
        playsInline
        className="camera-block__video"
      />

      {recording && (
        <div className="camera-block__recording-badge">
          <span className="camera-block__recording-dot" />
          Recording
        </div>
      )}

      {!externalControls && (
        <div className="camera-block__controls">
          {!recording ? (
            <button
              type="button"
              className="camera-block__btn camera-block__btn--start"
              onClick={startRecording}
              disabled={!cameraReady}
            >
              {cameraReady ? "Start interview" : "Loading camera…"}
            </button>
          ) : (
            <button
              type="button"
              className="camera-block__btn camera-block__btn--stop"
              onClick={stopRecording}
            >
              Stop interview
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export default Camera;
