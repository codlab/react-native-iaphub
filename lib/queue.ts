export interface Executor<T, OUT> {
  (item: T): OUT
}

export default class Queue<T, OUT> {

  private waiting: T[] = [];
  private isRunning = false;
  private isPaused = false;

  constructor(private executor: Executor<T, OUT>) {
  }
  
  public add(item: T) {
    this.waiting.push(item);
    this.run();
  }

  public pause() {
    this.isPaused = true;
  }

  public async resume() {
    this.isPaused = false;
    await this.run();
  }

  private async run() {
    if (this.isPaused || this.isRunning) return;
    // Get the items we're going to process, empty waiting list and mark the queue as running
    var items = this.waiting;
    this.waiting = [];
    this.isRunning = true;
    // Execute items in the waiting list
    await items.reduce(async (promise, item) => {
      await promise;
      try {
        await this.executor(item);
      } catch (err) {
        console.error(err);
      }
    }, Promise.resolve());
    // Mark the queue as not running
    this.isRunning = false;
    // Run again if there's more items in the waiting list
    if (this.waiting.length) {
      await this.run();
    }
  }

}