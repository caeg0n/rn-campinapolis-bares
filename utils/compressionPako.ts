// utils/compressionPako.ts - Using pako for compression (more reliable in Expo)
import * as pako from 'pako';

export class JSONCompressor {
  // Compress JSON string using Deflate (gzip-like)
  static compressJSON(jsonString: string): string {
    try {
      // Convert string to Uint8Array
      const input = new TextEncoder().encode(jsonString);
      
      // Compress using pako with maximum compression level
      const compressed = pako.deflate(input, { 
        level: 9, // Maximum compression level (0-9)
        windowBits: 15,
        memLevel: 8
      });
      
      // Convert to base64 for QR code compatibility
      return btoa(String.fromCharCode(...compressed));
    } catch (error) {
      console.error('Compression error:', error);
      // Fallback to simple base64 encoding
      return btoa(jsonString);
    }
  }
  
  // Decompress base64 string back to JSON
  static decompressJSON(base64String: string): string {
    try {
      // Decode from base64
      const binaryString = atob(base64String);
      const compressed = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        compressed[i] = binaryString.charCodeAt(i);
      }
      
      // Decompress using pako
      const decompressed = pako.inflate(compressed);
      
      // Convert back to string
      return new TextDecoder().decode(decompressed);
    } catch (error) {
      console.error('Decompression error:', error);
      // Fallback: try to decode as plain base64
      try {
        return atob(base64String);
      } catch (e) {
        return base64String; // Return as-is if all else fails
      }
    }
  }
  
  // Test compression ratio
  static getCompressionRatio(original: string): { 
    originalSize: number; 
    compressedSize: number; 
    ratio: number;
    savings: string;
  } {
    const compressed = this.compressJSON(original);
    const ratio = compressed.length / original.length;
    const savings = ((1 - ratio) * 100).toFixed(1);
    
    return {
      originalSize: original.length,
      compressedSize: compressed.length,
      ratio,
      savings: `${savings}%`
    };
  }
}