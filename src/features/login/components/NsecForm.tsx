import React, { useState } from "react";
import { useNsecLogin, AuthMethod } from "@/domains/auth";
import { useLoginUi } from "../hooks/useLoginUi";
import { Button } from "@/components/ui/button";

export function NsecForm() {
    const [nsec, setNsec] = useState("");
    const nsecLogin = useNsecLogin();
    const { setError } = useLoginUi();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            nsecLogin(nsec);
        } catch (err) {
            setError({
                method: AuthMethod.Nsec,
                message: err instanceof Error ? err.message : "nsec login failed",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
                type="password"
                placeholder="Enter your nsec..."
                value={nsec}
                onChange={(e) => setNsec(e.target.value)}
                autoFocus
                className="px-4 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
            />
            <Button variant="default" className="w-full">
                Login with nsec
            </Button>
        </form>
    );
}