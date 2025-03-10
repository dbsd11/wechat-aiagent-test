import { AICallAgentError, AICallAgentInfo, AICallState, AICallTemplateConfig } from 'aliyun-auikit-aicall';
import AUIAICallController from './AUIAICallController';

import standardService from './service/standard';
import AUIAICallConfig from './AUIAICallConfig';
import { APP_SERVER, TemplateConfig } from './service/interface';
import logger from '@/common/logger';

class AUIAICallStandardController extends AUIAICallController {
  constructor(userId: string, token: string, config?: AUIAICallConfig) {
    super(userId, token, config);
  }

  set appServer(appServerUrl: string) {
    standardService.setAppServer(appServerUrl);
  }

  async startAIAgent(): Promise<AICallAgentInfo> {
    logger.info('StandardController', 'StartAIAgent');
    let agentInfo: AICallAgentInfo | null = null;

    try {
      if (this.shareConfig) {
        logger.info('StandardController', 'StartAIAgent', {
          config: JSON.stringify(this.shareConfig),
        });

        agentInfo = await this.engine?.generateShareAgentCall(this.shareConfig, this.userId);
      } else {
        agentInfo = await standardService.generateAIAgent(this.userId, this.token, this.config);
      }
    } catch (error) {
      logger.error('GenerateAIAgentFailed', error as Error);
      throw error;
    }

    if (!agentInfo) {
      const error = new AICallAgentError('generate ai agent failed');
      logger.error('NoAIAgent', error);
      throw error;
    }

    try {
      // 每次先清空当前的配置
      this.config.templateConfig.avatarUrl = '';
      this.config.templateConfig.agentVoiceId = '';
      this.config.agentVoiceIdList = [];
      const templateConfig = await standardService.describeAIAgent(this.userId, this.token, agentInfo.instanceId);
      const configKey = AICallTemplateConfig.getTemplateConfigKey(agentInfo.agentType) as keyof TemplateConfig;
      const configValue = templateConfig[configKey];
      if (configValue?.AvatarUrl) {
        this.config.templateConfig.avatarUrl = configValue?.AvatarUrl as string;
      }
      if (configValue?.VoiceId) {
        this.config.templateConfig.agentVoiceId = configValue?.VoiceId as string;
      }
      if (configValue?.VoiceIdList) {
        this.config.agentVoiceIdList = configValue.VoiceIdList as string[];
      }
    } catch (error) {
      logger.error('DescribeAIAgentFailed', error as Error);
      console.log(error);
    }

    return agentInfo;
  }

  async stopAIAgent(): Promise<void> {
    logger.info('StandardController', 'StopAIAgent');
    this.engine?.stopAgent();
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 200);
    });
  }

  async enableVoiceInterrupt(enable: boolean): Promise<boolean> {
    logger.info('StandardController', 'EnableVoiceInterrupt', { enable });
    if (this.state === AICallState.Connected) {
      this.engine?.enableVoiceInterrupt(enable);
    }
    return true;
  }

  async switchVoiceId(voiceId: string): Promise<boolean> {
    logger.info('StandardController', 'SwitchVoiceId', { voiceId });
    if (this.state === AICallState.Connected) {
      this.engine?.switchVoiceId(voiceId);
    }
    return true;
  }

  async requestRTCToken(): Promise<string> {
    logger.info('StandardController', 'RequestRTCToken');
    if (this.state === AICallState.Connected) {
      this.engine?.requestRTCToken();

      // 等待返回新的 RTC token
      return new Promise((resolve) => {
        this.engine?.once('newRTCToken', (token: string) => {
    	      resolve(token);
        });
      });
    }
    return '';
  }

  destroy() {
    logger.info('StandardController', 'destroy');
    super.destroy();
    this.appServer = APP_SERVER;
  }
}

export default AUIAICallStandardController;
