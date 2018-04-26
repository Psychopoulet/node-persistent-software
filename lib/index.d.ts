/// <reference types="node" />

declare module "node-persistent-software" {

	class PersistantSoftware extends require("asynchronous-eventemitter") {

		protected _software: string;
		protected _args: Array<string>;
		protected _options: object;
		protected _ended: boolean;

		public maxCountRun: number;
		public successCountRun: number;

		constructor(software: string, args?: Array<string>, options?: object);

		public max(max: number): PersistantSoftware;
		public infinite(): PersistantSoftware;
		public start(): PersistantSoftware;
		public end(): PersistantSoftware;

	}

	export = PersistantSoftware;

}
