import React, { useEffect } from "react";
import { useLoginUi } from "../hooks/useLoginUi";
import { AuthMethod } from "@/domains/auth";
import { Nip07Button } from "./Nip07Button";
import { NsecForm } from "./NsecForm";
import { BunkerForm } from "./BunkerForm";
import { NostrConnectForm } from "./NostrConnectForm";
import { AuthError } from "./AuthError";
import { Button } from "@/components/ui/button";

export function LoginScreen() {
    const { activeMethod, setActiveMethod, error, setError } = useLoginUi();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center mb-2">Sign in to Nostr</h2>
                <div className="flex flex-col gap-3">
                    <Nip07Button active={activeMethod === AuthMethod.Nip07} />
                    <Button
                        variant={activeMethod === AuthMethod.Nsec ? "default" : "secondary"}
                        className={`w-full transition-all ${activeMethod === AuthMethod.Nsec ? "ring-2 ring-blue-400" : ""}`}
                        onClick={() => setActiveMethod(AuthMethod.Nsec)}
                    >
                        Login with nsec
                    </Button>
                    <Button
                        variant={activeMethod === AuthMethod.Bunker ? "default" : "secondary"}
                        className={`w-full transition-all ${activeMethod === AuthMethod.Bunker ? "ring-2 ring-blue-400" : ""}`}
                        onClick={() => setActiveMethod(AuthMethod.Bunker)}
                    >
                        Login with Bunker
                    </Button>
                    <Button
                        variant={activeMethod === AuthMethod.NostrConnect ? "default" : "secondary"}
                        className={`w-full transition-all ${activeMethod === AuthMethod.NostrConnect ? "ring-2 ring-blue-400" : ""}`}
                        onClick={() => setActiveMethod(AuthMethod.NostrConnect)}
                    >
                        Login with NostrConnect
                    </Button>
                </div>
                <div className="mt-4">
                    {activeMethod === AuthMethod.Nsec && <NsecForm />}
                    {activeMethod === AuthMethod.Bunker && <BunkerForm />}
                    {activeMethod === AuthMethod.NostrConnect && <NostrConnectForm />}
                </div>
                {error && (
                    <div className="mt-4">
                        <AuthError error={error} onClear={() => setError(null)} />
                    </div>
                )}
            </div>
        </div>
    );
}