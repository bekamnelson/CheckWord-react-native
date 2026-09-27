import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import ThemedDialog, { DialogOptions } from '../components/ThemedDialog';

interface DialogContextValue {
    // Remplace Alert.alert : boîte de dialogue aux couleurs du thème actif.
    showDialog: (options: DialogOptions) => void;
}

const DialogContext = createContext<DialogContextValue>({ showDialog: () => {} });

export function DialogProvider({ children }: { children: React.ReactNode }) {
    const [current, setCurrent] = useState<DialogOptions | null>(null);
    // Une boîte à la fois : les suivantes attendent leur tour.
    const queue = useRef<DialogOptions[]>([]);

    const showDialog = useCallback((options: DialogOptions) => {
        setCurrent((prev) => {
            if (prev) {
                queue.current.push(options);
                return prev;
            }
            return options;
        });
    }, []);

    const close = useCallback(() => {
        setCurrent(queue.current.shift() ?? null);
    }, []);

    const value = useMemo(() => ({ showDialog }), [showDialog]);

    return (
        <DialogContext.Provider value={value}>
            {children}
            <ThemedDialog options={current} onClose={close} />
        </DialogContext.Provider>
    );
}

export const useDialog = () => useContext(DialogContext);
