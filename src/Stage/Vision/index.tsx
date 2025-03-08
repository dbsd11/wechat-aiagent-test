import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ControllerContext from '@/common/ControlerContext';

import './index.less';

function Vision() {
  const previewRef = useRef<HTMLVideoElement>(null);
  const controller = useContext(ControllerContext);
  const [cameraLoading, setCameraLoading] = useState(false);

  const loaded = useCallback(() => {
    setCameraLoading(false);
  }, []);

  useEffect(() => {
    if (previewRef.current) {
      controller?.startPreview(previewRef.current);
    }
  }, [controller]);

  useEffect(() => {
    const videoElement = previewRef.current;
    if (cameraLoading) {
      // canplay / timeupdate 都认为是加载完成
      videoElement?.addEventListener('canplay', loaded);
      videoElement?.addEventListener('timeupdate', loaded);
    }
    return () => {
      videoElement?.removeEventListener('canplay', loaded);
      videoElement?.removeEventListener('timeupdate', loaded);
    };
  }, [cameraLoading, loaded]);

  return (
    <div className={`character vision has-camera`}>
      {cameraLoading && (
        <div className='_loading'>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      <video ref={previewRef} className={cameraLoading ? '' : '_loaded'} />
    </div>
  );
}

export default Vision;
