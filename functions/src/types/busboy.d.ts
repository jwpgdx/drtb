declare module "busboy" {
    interface BusboyConfig {
      headers: Record<string, string | string[] | undefined>; // any → 명확한 타입
      [key: string]: unknown; // any → unknown
    }

    interface Busboy extends NodeJS.EventEmitter {
      on(event: "file", listener: (fieldname: string, file: NodeJS.ReadableStream, filename: string | undefined) => void): this;
      on(event: "finish", listener: () => void): this;
      on(event: string, listener: (...args: unknown[]) => void): this; // Function → (...args: unknown[]) => void
    }

    export default function (config: BusboyConfig): Busboy;
  }
