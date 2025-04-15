declare module 'busboy' {
    interface BusboyConfig {
        headers: any;
        [key: string]: any;
    }

    interface Busboy extends NodeJS.EventEmitter {
        on(event: 'file', listener: (fieldname: string, file: NodeJS.ReadableStream, filename: any) => void): this;
        on(event: 'finish', listener: () => void): this;
        on(event: string, listener: Function): this;
    }

    export default function (config: BusboyConfig): Busboy;
}