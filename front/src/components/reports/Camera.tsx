import React, { useRef, useCallback, useState } from 'react';
import styled from 'styled-components';

const CameraContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
`;

const Video = styled.video`
  width: 100%;
  border-radius: 12px;
  background: #000;
`;

const Canvas = styled.canvas`
  display: none;
`;

const CapturedImage = styled.img`
  width: 100%;
  border-radius: 12px;
  display: block;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  background: ${props => props.variant === 'danger' ? '#FF3B30' : '#007AFF'};
  color: white;

  &:hover {
    background: ${props => props.variant === 'danger' ? '#FF2D20' : '#0056b3'};
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #FF3B30;
  text-align: center;
  margin-top: 16px;
  padding: 12px;
  background: #FFE5E5;
  border-radius: 8px;
`;

interface CameraProps {
  onCapture: (imageBlob: Blob) => void;
  onClose: () => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<{ blob: Blob; url: string } | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      setError('카메라 접근에 실패했습니다. 카메라 권한을 확인해주세요.');
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage.url);
      }
    };
  }, [startCamera, stopCamera, capturedImage]);

  const addWatermark = (context: CanvasRenderingContext2D, width: number, height: number) => {
    const now = new Date();
    const timestamp = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    context.font = '16px sans-serif';
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 2;

    const text = `촬영시간: ${timestamp}`;
    const textWidth = context.measureText(text).width;
    const x = width - textWidth - 20;
    const y = height - 20;

    context.strokeText(text, x, y);
    context.fillText(text, x, y);
  };

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        addWatermark(context, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            setCapturedImage({ blob, url: imageUrl });
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  }, [stopCamera]);

  const retake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage.url);
      setCapturedImage(null);
    }
    startCamera();
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <CameraContainer>
      {!capturedImage && <Video ref={videoRef} autoPlay playsInline />}
      {capturedImage && <CapturedImage src={capturedImage.url} alt="Captured" />}
      <Canvas ref={canvasRef} />
      
      <ButtonContainer>
        {!capturedImage ? (
          <>
            <Button onClick={captureImage}>촬영</Button>
            <Button variant="danger" onClick={onClose}>취소</Button>
          </>
        ) : (
          <>
            <Button onClick={() => onCapture(capturedImage.blob)}>사용</Button>
            <Button variant="danger" onClick={retake}>다시 촬영</Button>
          </>
        )}
      </ButtonContainer>
    </CameraContainer>
  );
};

export default Camera;
