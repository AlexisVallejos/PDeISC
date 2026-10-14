"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false en el servidor y durante la hidratación, true después: evita diferencias de HTML
export const useMounted = (): boolean => useSyncExternalStore(subscribe, () => true, () => false);
