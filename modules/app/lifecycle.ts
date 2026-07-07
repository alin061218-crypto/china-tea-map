import { bootstrap, BootstrappedApplication, BootstrapOptions } from './bootstrap';
import { RuntimeAction, RuntimeController } from './runtime-controller';

export type LifecycleStatus = 'idle' | 'mounted' | 'updating' | 'tearingDown' | 'recovering';

export interface LifecycleSnapshot {
  status: LifecycleStatus;
  mounted: boolean;
}

export class SystemLifecycleManager {
  private app: BootstrappedApplication | null = null;
  private controller: RuntimeController | null = null;
  private options: BootstrapOptions = {};
  private status: LifecycleStatus = 'idle';

  mount(options: BootstrapOptions = {}): LifecycleSnapshot {
    if (this.app) return this.getSnapshot();

    this.options = options;
    this.app = bootstrap(options);
    this.controller = new RuntimeController({
      eventBus: this.app.eventBus,
      transitionPipeline: this.app.transitionPipeline,
      renderSync: this.app.renderSync,
    });
    this.controller.start();
    this.status = 'mounted';
    return this.getSnapshot();
  }

  update(action?: RuntimeAction): LifecycleSnapshot {
    if (!this.app || !this.controller) {
      return this.mount(this.options);
    }

    this.status = 'updating';
    if (action) this.controller.dispatch(action);
    this.status = 'mounted';
    return this.getSnapshot();
  }

  teardown(): LifecycleSnapshot {
    if (!this.app) {
      this.status = 'idle';
      return this.getSnapshot();
    }

    this.status = 'tearingDown';
    this.controller?.stop();
    this.app.animationEngine.stop();
    this.app.eventBus.clear();
    this.controller = null;
    this.app = null;
    this.status = 'idle';
    return this.getSnapshot();
  }

  recover(): LifecycleSnapshot {
    const options = this.options;
    this.status = 'recovering';
    this.teardown();
    return this.mount(options);
  }

  getRuntime(): BootstrappedApplication | null {
    return this.app;
  }

  getController(): RuntimeController | null {
    return this.controller;
  }

  getSnapshot(): LifecycleSnapshot {
    return {
      status: this.status,
      mounted: Boolean(this.app),
    };
  }
}

export function createLifecycleManager(): SystemLifecycleManager {
  return new SystemLifecycleManager();
}
