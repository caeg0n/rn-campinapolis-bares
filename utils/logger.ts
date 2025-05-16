// utils/logger.ts

// Global declaration for __DEV__ if not available
declare const __DEV__: boolean;

export class Logger {
  private static isDevelopment = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

  // Colors for console logs (if supported)
  private static colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  };

  private static formatMessage(level: string, tag: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${tag}] ${message}`;
  }

  static info(tag: string, message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.log(
        `${this.colors.blue}${this.formatMessage('INFO', tag, message)}${this.colors.reset}`,
        ...args
      );
    }
  }

  static success(tag: string, message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.log(
        `${this.colors.green}${this.formatMessage('SUCCESS', tag, message)}${this.colors.reset}`,
        ...args
      );
    }
  }

  static warning(tag: string, message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.warn(
        `${this.colors.yellow}${this.formatMessage('WARNING', tag, message)}${this.colors.reset}`,
        ...args
      );
    }
  }

  static error(tag: string, message: string, error?: any, ...args: any[]): void {
    if (this.isDevelopment) {
      console.error(
        `${this.colors.red}${this.formatMessage('ERROR', tag, message)}${this.colors.reset}`,
        error,
        ...args
      );
    }
  }

  static debug(tag: string, message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(
        `${this.colors.dim}${this.formatMessage('DEBUG', tag, message)}${this.colors.reset}`
      );
      if (data !== undefined) {
        console.log(`${this.colors.dim}`, JSON.stringify(data, null, 2), `${this.colors.reset}`);
      }
    }
  }

  // QR Code specific logging methods
  static qrScanStart(data: { length: number; preview: string }): void {
    this.info('QR_SCAN', '=== QR CODE SCAN START ===');
    this.info('QR_SCAN', `Data length: ${data.length} characters`);
    this.info('QR_SCAN', `Preview: ${data.preview}...`);
  }

  static qrScanSuccess(data: any): void {
    this.success('QR_SCAN', '✅ QR Code successfully processed');
    this.debug('QR_SCAN', 'Processed data:', data);
  }

  static qrScanError(error: any, rawData?: string): void {
    this.error('QR_SCAN', '❌ QR Code processing failed', error);
    if (rawData) {
      this.debug('QR_SCAN', 'Raw data that failed:', rawData);
    }
  }

  static qrValidation(result: { valid: boolean; reason?: string; details?: any }): void {
    if (result.valid) {
      this.success('QR_VALIDATION', '✅ QR Code format validation passed');
    } else {
      this.warning('QR_VALIDATION', `❌ QR Code validation failed: ${result.reason}`);
      if (result.details) {
        this.debug('QR_VALIDATION', 'Validation details:', result.details);
      }
    }
  }

  // Sync operation logging
  static syncStart(operation: string, details?: any): void {
    this.info('SYNC', `=== ${operation.toUpperCase()} START ===`);
    if (details) {
      this.debug('SYNC', 'Operation details:', details);
    }
  }

  static syncSuccess(operation: string, result?: any): void {
    this.success('SYNC', `✅ ${operation} completed successfully`);
    if (result) {
      this.debug('SYNC', 'Operation result:', result);
    }
  }

  static syncError(operation: string, error: any): void {
    this.error('SYNC', `❌ ${operation} failed`, error);
  }

  // Table operations logging
  static tableOperation(operation: string, tableId: number, details?: any): void {
    this.info('TABLE', `${operation} - Table ${tableId}`);
    if (details) {
      this.debug('TABLE', 'Operation details:', details);
    }
  }

  // Person operations logging
  static personOperation(operation: string, personName: string, details?: any): void {
    this.info('PERSON', `${operation} - ${personName}`);
    if (details) {
      this.debug('PERSON', 'Operation details:', details);
    }
  }

  // Data processing logging
  static dataProcess(process: string, input: any, output?: any): void {
    this.info('DATA', `Processing: ${process}`);
    this.debug('DATA', 'Input:', input);
    if (output !== undefined) {
      this.debug('DATA', 'Output:', output);
    }
  }

  // Compression logging
  static compressionStats(stats: {
    originalSize: number;
    compressedSize: number;
    ratio: number;
    savings: string;
  }): void {
    this.info('COMPRESSION', 'Compression statistics:');
    this.info('COMPRESSION', `- Original size: ${stats.originalSize} bytes`);
    this.info('COMPRESSION', `- Compressed size: ${stats.compressedSize} bytes`);
    this.info('COMPRESSION', `- Compression ratio: ${stats.ratio.toFixed(3)}`);
    this.info('COMPRESSION', `- Space savings: ${stats.savings}`);
  }

  // Performance logging
  static performance(operation: string, duration: number): void {
    this.info('PERFORMANCE', `${operation} completed in ${duration}ms`);
  }

  // Create a timer for performance measurement
  static startTimer(operation: string): () => void {
    const start = Date.now();
    this.info('TIMER', `Started: ${operation}`);
    
    return () => {
      const duration = Date.now() - start;
      this.performance(operation, duration);
    };
  }
}