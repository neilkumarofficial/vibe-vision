import { TriangleAlert } from 'lucide-react';
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  isError?: boolean;
}

const MessageToast: React.FC<ToastProps> = ({ message, visible, onClose, isError = false }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`fixed z-[3000] flex gap-4 items-center bottom-4 right-4 transform transition-transform duration-700 ${visible ? '-translate-x-0' : 'translate-x-[150%]'} px-6 py-4 text-lg bg-neutral-950 border border-gray-800 text-white rounded shadow-lg`} >
      <style>
        {`
.spinner {
  animation: spinner-y0fdc1 2s infinite ease;
  transform-style: preserve-3d;
}

.spinner > div {
  background-color: rgb(255, 254, 254, 0.6);
  height: 100%;
  position: absolute;
  width: 100%;
  border: 2px solid #a855f7;
}

.spinner div:nth-of-type(1) {
  transform: translateZ(-12px) rotateY(180deg);
}

.spinner div:nth-of-type(2) {
  transform: rotateY(-270deg) translateX(50%);
  transform-origin: top right;
}

.spinner div:nth-of-type(3) {
  transform: rotateY(270deg) translateX(-50%);
  transform-origin: center left;
}

.spinner div:nth-of-type(4) {
  transform: rotateX(90deg) translateY(-50%);
  transform-origin: top center;
}

.spinner div:nth-of-type(5) {
  transform: rotateX(-90deg) translateY(50%);
  transform-origin: bottom center;
}

.spinner div:nth-of-type(6) {
  transform: translateZ(12px);
}

@keyframes spinner-y0fdc1 {
  0% {
    transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
  }

  50% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
  }

  100% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
  }
}
    

                `}
      </style>
      {
        !isError ?
          <div className="spinner size-6 border/ border-purple-500">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          :
          < TriangleAlert className='text-red-400' />
      }
      <div className='max-w-60 md:max-w-96 text-sm md:text-base'> {message} </div>
    </div>
  );
};

export default MessageToast;
