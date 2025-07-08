export interface UnityWebGLConfig {
  buildPath: string;
  gameName: string;
  width?: number;
  height?: number;
  onProgress?: (progress: number) => void;
  onLoaded?: () => void;
  onError?: (error: string) => void;
}

export interface UnityMessage {
  type: string;
  data: any;
}

export class UnityWebGLService {
  private unityInstance: any = null;
  private canvas: HTMLCanvasElement | null = null;
  private config: UnityWebGLConfig;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(config: UnityWebGLConfig) {
    this.config = config;
  }

  async loadUnityBuild(container?: HTMLElement): Promise<void> {
    try {
      // Create canvas element if not provided
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.config.width || 1280;
        this.canvas.height = this.config.height || 720;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
      }

      // Attach canvas to container if provided
      if (container && this.canvas) {
        container.appendChild(this.canvas);
      }

      // Load Unity WebGL build files
      await this.loadUnityFiles();
      
      // Initialize Unity instance
      await this.initializeUnity();
      
      this.config.onLoaded?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load Unity WebGL build';
      this.config.onError?.(errorMessage);
      throw error;
    }
  }

  private async loadUnityFiles(): Promise<void> {
    const buildPath = this.config.buildPath;
    
    // Load Unity WebGL build files
    const files = [
      `${buildPath}/Build/Build.framework.js`,
      `${buildPath}/Build/Build.loader.js`
    ];

    for (const file of files) {
      await this.loadScript(file);
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  private async initializeUnity(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Use Unity WebGL loader if available
      if (window.UnityWebGL && this.canvas) {
        window.UnityWebGL.loadBuild({
          canvas: this.canvas,
          width: this.config.width,
          height: this.config.height
        }).then((instance: any) => {
          this.unityInstance = instance;
          this.setupMessageHandling();
          resolve();
        }).catch((error: any) => {
          reject(error);
        });
      } else {
        // Fallback to simulation
        setTimeout(() => {
          this.unityInstance = {
            canvas: this.canvas,
            sendMessage: (gameObject: string, method: string, parameter: any) => {
              console.log('Unity message sent:', { gameObject, method, parameter });
            },
            quit: () => {
              console.log('Unity instance quit');
            }
          };
          
          this.setupMessageHandling();
          resolve();
        }, 1000);
      }
    });
  }

  private setupMessageHandling(): void {
    // Set up communication between Unity and React
    if (window.unityInstance) {
      window.unityInstance = this.unityInstance;
    }
    
    // Listen for messages from Unity
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'unity') {
        this.handleUnityMessage(event.data);
      }
    });
  }

  private handleUnityMessage(message: UnityMessage): void {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message.data);
    }
  }

  // Public methods for interacting with Unity
  sendMessage(gameObject: string, method: string, parameter?: any): void {
    if (this.unityInstance) {
      this.unityInstance.sendMessage(gameObject, method, parameter);
    }
  }

  onUnityMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  quit(): void {
    if (this.unityInstance) {
      this.unityInstance.quit();
      this.unityInstance = null;
    }
  }

  // Game-specific methods
  pauseGame(): void {
    this.sendMessage('GameManager', 'PauseGame');
  }

  resumeGame(): void {
    this.sendMessage('GameManager', 'ResumeGame');
  }

  restartGame(): void {
    this.sendMessage('GameManager', 'RestartGame');
  }

  setGameVolume(volume: number): void {
    this.sendMessage('AudioManager', 'SetVolume', volume);
  }

  // Casino game specific methods
  placeBet(amount: number): void {
    this.sendMessage('CasinoGame', 'PlaceBet', amount);
  }

  spinSlotMachine(): void {
    this.sendMessage('SlotMachine', 'Spin');
  }

  dealCards(): void {
    this.sendMessage('CardGame', 'DealCards');
  }
}

// Global Unity instance for external access
declare global {
  interface Window {
    unityInstance?: any;
    UnityWebGL?: {
      loadBuild: (config: any) => Promise<any>;
    };
  }
}

export default UnityWebGLService; 