declare module 'papaparse' {
    export type ParseResult<T> = {
      data: T[];
      errors: any[];
      meta: {
        delimiter: string;
        linebreak: string;
        aborted: boolean;
        truncated: boolean;
        cursor: number;
      };
    };
  
    export interface ParseConfig {
      delimiter?: string;
      newline?: string;
      quoteChar?: string;
      escapeChar?: string;
      header?: boolean;
      dynamicTyping?: boolean | { [headerName: string]: boolean };
      preview?: number;
      encoding?: string;
      worker?: boolean;
      comments?: boolean | string;
      step?: (results: ParseResult<any>, parser: any) => void;
      complete?: (results: ParseResult<any>) => void;
      error?: (error: any) => void;
      download?: boolean;
      skipEmptyLines?: boolean | 'greedy';
      fastMode?: boolean;
      beforeFirstChunk?: (chunk: string) => string | void;
      withCredentials?: boolean;
      transform?: (value: any, field: string | number) => any;
    }
  
    export function parse<T>(
      csvString: string,
      config?: ParseConfig
    ): ParseResult<T>;
  
    export function unparse(data: any, config?: any): string;
  }
  