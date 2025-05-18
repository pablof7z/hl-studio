import React from "react";
import { useNip07Login, AuthMethod } from "@/domains/auth";
import { useLoginUi } from "../hooks/useLoginUi";
import { Button } from "@/components/ui/button";

type Nip07ButtonProps = {
    active?: boolean;
};

export function Nip07Button({ active = false }: Nip07ButtonProps) {
    const nip07Login = useNip07Login();
    const { setActiveMethod, setError } = useLoginUi();

    const handleClick = async () => {
        setActiveMethod(AuthMethod.Nip07);
        try {
            nip07Login();
        } catch (e) {
            setError({
                method: AuthMethod.Nip07,
                message: e instanceof Error ? e.message : "NIP-07 login failed",
            });
        }
    };

    return (
        <Button
            variant={active ? "default" : "secondary"}
            className={`w-full transition-all ${active ? "ring-2 ring-blue-400" : ""}`}
            onClick={handleClick}
        >
            Login with NIP-07 Extension
        </Button>
    );
}