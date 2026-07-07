export const EVENT_CHANNELS = ['NAV', 'MAP', 'ANIM', 'CONTENT', 'UI'] as const;

export type EventChannel = typeof EVENT_CHANNELS[number];
export type EventPayload = Record<string, unknown>;
export type EventHandler<TPayload extends EventPayload = EventPayload> = (payload: TPayload) => void;
export type EventUnsubscribe = () => void;

export class EventBus {
  private readonly listeners = new Map<string, Set<EventHandler>>();

  subscribe<TPayload extends EventPayload>(
    channel: EventChannel,
    eventName: string,
    handler: EventHandler<TPayload>,
  ): EventUnsubscribe {
    const key = this.key(channel, eventName);
    const handlers = this.listeners.get(key) ?? new Set<EventHandler>();
    handlers.add(handler as EventHandler);
    this.listeners.set(key, handlers);

    return () => {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) this.listeners.delete(key);
    };
  }

  publish<TPayload extends EventPayload>(channel: EventChannel, eventName: string, payload: TPayload): void {
    const handlers = this.listeners.get(this.key(channel, eventName));
    if (!handlers) return;

    handlers.forEach((handler) => handler(payload));
  }

  clear(): void {
    this.listeners.clear();
  }

  private key(channel: EventChannel, eventName: string): string {
    return `${channel}:${eventName}`;
  }
}
