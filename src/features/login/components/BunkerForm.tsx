import React, { useState } from "react";
import { useBunkerLogin, AuthMethod } from "@/domains/auth";
import { useLoginUi } from "../hooks/useLoginUi";
import { Button } from "@/components/ui/button";

export function BunkerForm() {
    const [uri, setUri] = useState("");
    const bunkerLogin = useBunkerLogin();
    const { setError } = useLoginUi();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            bunkerLogin(uri);
        } catch (err) {
            setError({
                method: AuthMethod.Bunker,
                message: err instanceof Error ? err.message : "Bunker login failed",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
                type="text"
                placeholder="Enter your Bunker URI..."
                value={uri}
                onChange={(e) => setUri(e.target.value)}
                autoFocus
                className="px-4 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
            />
            <Button variant={"default"} className="w-full">
                Login with Bunker
            </Button>
        </form>
    );
}