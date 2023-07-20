export class ParseUtil {
    parse(message: string) {
      return JSON.parse(message);
    }
  
    stringify(input: any) {
      return JSON.stringify(input);
    }
  }