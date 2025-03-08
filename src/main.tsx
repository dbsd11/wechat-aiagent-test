import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { addRootClass, isMobileDevice } from '@/common/utils.ts';

// import createBackground from './background';
import createQrcode from './qrcode.ts';
import { AICallAgentType } from 'aliyun-auikit-aicall';

const isMobile = isMobileDevice();
if (!isMobile) {
  // document.body.classList.add('is-pc');
}



const root = document.getElementById('root');
if (!root) throw new Error('root element not found');
addRootClass(root);
createRoot(root).render(<App agentType={AICallAgentType.VisionAgent} />);

if (!isMobile) {
  createQrcode();
}
