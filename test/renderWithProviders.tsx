// test/renderWithProviders.tsx
import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { getTestNDK } from "./ndkTestUtils";

/**
 * Custom render function that wraps components with NDKProvider
 * and any other global providers needed for tests.
 */
function Providers({ children }: { children: React.ReactNode }) {
    // Use the singleton test NDK instance
    const ndk = getTestNDK();
    return <>{children}</>;
}

export function renderWithProviders(
    ui: React.ReactElement,
    options?: Omit<RenderOptions, "wrapper">
) {
    return render(ui, { wrapper: Providers, ...options });
}