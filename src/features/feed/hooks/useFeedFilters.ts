import { useState } from "react";

export function useFeedFilters() {
    const [search, setSearch] = useState("");
    const [kind, setKind] = useState<number | null>(null);

    return {
        search,
        setSearch,
        kind,
        setKind,
    };
}