'use client';

import * as React from 'react';

type ToastProps = {
    title?: string;
    description?: string;
    action?: React.ReactNode;
    variant?: 'default' | 'destructive';
    id?: string;
};

type ToasterProps = {
    children: React.ReactNode;
};

type ToastState = {
    toasts: Toast[];
};

type ToastActionType = {
    addToast: (toast: Omit<Toast, 'id'>) => string;
    updateToast: (toast: Partial<Toast> & { id: string }) => void;
    dismissToast: (toastId?: string) => void;
    removeToast: (toastId: string) => void;
};

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 2000;

// Create a context to store toast state
const ToastContext = React.createContext<ToastState & ToastActionType>({
    toasts: [],
    addToast: () => {},
    updateToast: () => {},
    dismissToast: () => {},
    removeToast: () => {},
});

function useToast() {
    return React.useContext(ToastContext);
}

type Toast = {
    id: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    variant?: 'default' | 'destructive';
    duration?: number;
};

function Toaster({ children }: ToasterProps) {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const hideToast = React.useCallback((toastId: string) => {
        setToasts((prev) => prev.map((toast) => (toast.id === toastId ? { ...toast, open: false } : toast)));
    }, []);

    const removeToast = React.useCallback((toastId: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
    }, []);

    const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
        const id = crypto.randomUUID();

        setToasts((prev) => {
            if (prev.length >= TOAST_LIMIT) {
                return [...prev.slice(1), { id, ...toast, open: true }];
            }

            return [...prev, { id, ...toast, open: true }];
        });
        return id;
    }, []);

    const updateToast = React.useCallback((toast: Partial<Toast> & { id: string }) => {
        setToasts((prev) => prev.map((t) => (t.id === toast.id ? { ...t, ...toast } : t)));
    }, []);

    const dismissToast = React.useCallback(
        (toastId?: string) => {
            if (toastId) {
                hideToast(toastId);
                setTimeout(() => removeToast(toastId), TOAST_REMOVE_DELAY);
            } else {
                toasts.forEach((toast) => {
                    hideToast(toast.id);
                    setTimeout(() => removeToast(toast.id), TOAST_REMOVE_DELAY);
                });
            }
        },
        [hideToast, removeToast, toasts]
    );

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                dismissToast();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [dismissToast]);

    return React.createElement(
        ToastContext.Provider,
        {
            value: {
                toasts,
                addToast,
                updateToast,
                dismissToast,
                removeToast,
            },
        },
        children
    );
}

type ToastReturn = {
    id: string | null;
    dismiss: () => void;
    update: (options: ToastProps) => void;
};

function toast({ ...props }: Omit<ToastProps, 'id'>): ToastReturn {
    let toastId: string | null = null;

    const { addToast, updateToast, dismissToast } = useToast();

    if (typeof props === 'string') {
        toastId = addToast({ title: props });
    } else if (typeof props === 'object') {
        toastId = addToast(props);
    }

    return {
        id: toastId,
        dismiss: () => dismissToast(toastId),
        update: (options: ToastProps) => updateToast({ ...options, id: toastId! }),
    };
}

export { toast, useToast, Toaster };
