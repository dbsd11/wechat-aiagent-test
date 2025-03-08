import { animated, useSpring } from '@react-spring/web';

import './connecting.less';
import useCallStore from '@/common/store';
import { AICallAgentType, AICallState } from 'aliyun-auikit-aicall';

const Connecting = () => {
  const callState = useCallStore((state) => state.callState);
  const agentType = useCallStore((state) => state.agentType);

  const isTipVisible = callState === AICallState.None;
  const styles = useSpring({
    opacity: isTipVisible ? 1 : 0,
    y: isTipVisible ? 0 : -22,
  });

  return (
    <div className='connecting'>
      {callState === AICallState.None && (
        <animated.div className='_tip' style={styles}>
          {agentType === AICallAgentType.VoiceAgent ? '邀请您进行语音聊天' : '邀请您进行视频聊天'}
        </animated.div>
      )}
      
      {callState === AICallState.Connecting && (
        <ul className='_loading'>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      )}

      {callState === AICallState.Over && (
        <animated.div className='_tip' style={styles}>
          {'通话结束'}
        </animated.div>
      )}
    </div>
  );
};

export default Connecting;
