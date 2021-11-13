export interface Executor<T, OUT> {
    (item: T): OUT;
}
export default class Queue<T, OUT> {
    private executor;
    private waiting;
    private isRunning;
    private isPaused;
    constructor(executor: Executor<T, OUT>);
    add(item: T): void;
    pause(): void;
    resume(): Promise<void>;
    private run;
}
