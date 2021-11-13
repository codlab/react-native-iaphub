export interface OnUserUpdated {
    (): void;
}
export interface EventsMap {
    ["onUserUpdated"]: OnUserUpdated;
}
