export class DIContainer {
  private services: Map<string, any> = new Map();
  private factories: Map<string, () => any> = new Map();

  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  registerFactory<T>(name: string, factory: () => T): void {
    this.factories.set(name, factory);
  }

  get<T>(name: string): T {
    if (this.services.has(name)) {
      return this.services.get(name) as T;
    }

    if (this.factories.has(name)) {
      const factory = this.factories.get(name)!;
      const instance = factory();
      this.services.set(name, instance);
      return instance as T;
    }

    throw new Error(`Service '${name}' not found in container`);
  }

  has(name: string): boolean {
    return this.services.has(name) || this.factories.has(name);
  }

  remove(name: string): void {
    this.services.delete(name);
    this.factories.delete(name);
  }

  clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}
