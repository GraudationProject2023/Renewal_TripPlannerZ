import "@testing-library/jest-dom";

export class MockEventSource {
  url: string = "";
  onmessage: ((ev: MessageEvent) => any) | null = null;
  onerror: ((ev: Event) => any) | null = null;

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }

  static instances: MockEventSource[] = [];

  emitMessage(data: any) {
    if (this.onmessage) {
      this.onmessage(
        new MessageEvent("message", { data: JSON.stringify(data) }),
      );
    }
  }

  emitError() {
    if (this.onerror) {
      this.onerror(new Event("error"));
    }
  }

  close() {}
}

(global as any).EventSource = MockEventSource;
