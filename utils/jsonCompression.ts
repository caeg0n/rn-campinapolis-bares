// utils/jsonCompression.ts - Simple JSON compression without any dependencies
export class JSONCompressor {
  // Simple compression using character substitution and minification
  static compressJSON(jsonString: string): string {
    try {
      // Remove unnecessary whitespace first
      const minified = JSON.stringify(JSON.parse(jsonString));
      
      // Simple character substitution for common patterns
      let compressed = minified
        .replace(/\"n\":/g, 'N')  // name field
        .replace(/\"nm\":/g, 'M') // name field (table)
        .replace(/\"p\":/g, 'P')  // people/products
        .replace(/\"b\":/g, 'B')  // bill
        .replace(/\"o\":/g, 'O')  // orders
        .replace(/\"pr\":/g, 'R') // price
        .replace(/\"q\":/g, 'Q')  // quantity
        .replace(/\"pd\":/g, 'D') // paid
        .replace(/\"v\":/g, 'V')  // version
        .replace(/\"t\":/g, 'T')  // timestamp
        .replace(/\"d\":/g, 'A')  // data
        .replace(/false/g, '0')   // boolean false to 0
        .replace(/true/g, '1');   // boolean true to 1
      
      // Use built-in btoa for base64 encoding
      return btoa(compressed);
    } catch (error) {
      console.error('Compression error:', error);
      return jsonString; // Return uncompressed if error
    }
  }
  
  // Decompress base64 string back to JSON
  static decompressJSON(base64String: string): string {
    try {
      // Decode from base64 using built-in atob
      const compressed = atob(base64String);
      
      // Reverse the character substitutions
      const decompressed = compressed
        .replace(/N/g, '\"n\":')
        .replace(/M/g, '\"nm\":')
        .replace(/P/g, '\"p\":')
        .replace(/B/g, '\"b\":')
        .replace(/O/g, '\"o\":')
        .replace(/R/g, '\"pr\":')
        .replace(/Q/g, '\"q\":')
        .replace(/D/g, '\"pd\":')
        .replace(/V/g, '\"v\":')
        .replace(/T/g, '\"t\":')
        .replace(/A/g, '\"d\":');
      
      return decompressed;
    } catch (error) {
      console.error('Decompression error:', error);
      return base64String; // Return as-is if error
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