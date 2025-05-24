'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { Dialog } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAccountStore } from '@/domains/account/stores/accountStore';
import UserAvatar from '@/features/nostr/components/user/UserAvatar';
import { NDKPublication } from '@/features/publication/event/publication';
import { cn } from '@/lib/utils';
import { useNDK, useNDKCurrentPubkey, useProfileValue, useSubscribe } from '@nostr-dev-kit/ndk-hooks';
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { useEffect, useMemo } from 'react';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

type AccountSwitcherProps = PopoverTriggerProps & {
    className?: string;
};

export function AccountSwitcher({ className }: AccountSwitcherProps) {
    // const router = useRouter()
    const [open, setOpen] = React.useState(false);
    const [showNewAccountDialog, setShowNewAccountDialog] = React.useState(false);
    const currentPubkey = useNDKCurrentPubkey();
    const userProfile = useProfileValue(currentPubkey);
    const selectedAccount = useAccountStore((state) => state.selectedAccount);
    const setSelectedAccount = useAccountStore((state) => state.setSelectedAccount);
    const { events: _publications } = useSubscribe(
        currentPubkey
            ? [
                { kinds: [NDKPublication.kind], authors: [currentPubkey] },
                { kinds: [NDKPublication.kind], '#p': [currentPubkey] },
            ] : false,
        { wrap: false },
        [currentPubkey]
    );
    const publications = useMemo(() => _publications.map(NDKPublication.from), [_publications]);

    React.useEffect(() => {
        // set default selectedAccount to current user if not set
        if (currentPubkey && !selectedAccount) {
            setSelectedAccount({ type: 'user', id: currentPubkey });
        }
    }, [currentPubkey, selectedAccount, setSelectedAccount]);

    return (
        <Dialog open={showNewAccountDialog} onOpenChange={setShowNewAccountDialog}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select an account"
                        className={cn('w-[220px] justify-between', className)}
                    >
                        <div className="flex items-center gap-2 truncate overflow-hidden">
                            {selectedAccount ? (
                                selectedAccount.type === 'user' ? (
                                    <>
                                        <UserAvatar
                                            pubkey={selectedAccount.id}
                                            size={'xs'}
                                            alt={userProfile?.displayName || ''}
                                        />
                                        <span className="font-medium">
                                            {userProfile?.displayName ?? selectedAccount.id}
                                        </span>
                                    </>
                                ) : (
                                    (() => {
                                        const publication = publications.find((p) => p.id === selectedAccount.id);
                                        return publication ? (
                                            <>
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage
                                                        src={publication.image || ''}
                                                    />
                                                    <AvatarFallback>AI</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">
                                                    {publication.title}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={'/letter-a-abstract.png'} alt="" />
                                                    <AvatarFallback>AI</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{selectedAccount.id}</span>
                                            </>
                                        );
                                    })()
                                )
                            ) : null}
                        </div>
                        <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0">
                    <Command>
                        <CommandList>
                            <CommandInput placeholder="Search accounts..." />
                            <CommandEmpty>No accounts found.</CommandEmpty>

                            <CommandGroup heading="Account" className="overflow-auto">
                                <CommandItem
                                    key={currentPubkey}
                                    value={currentPubkey}
                                    onSelect={() => {
                                        setSelectedAccount({ type: 'user', id: currentPubkey! });
                                        setOpen(false);
                                    }}
                                    className="text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <UserAvatar
                                            pubkey={currentPubkey}
                                            size="xs"
                                            alt={userProfile?.displayName || ''}
                                        />
                                        <span>{userProfile?.displayName ?? currentPubkey}</span>
                                    </div>
                                    <CheckIcon
                                        className={cn(
                                            'ml-auto h-4 w-4',
                                            selectedAccount?.type === 'user' && selectedAccount?.id === currentPubkey
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            </CommandGroup>

                            <CommandGroup heading="Publications" className="overflow-auto">
                                {publications.map((publication) => (
                                    <CommandItem
                                        key={publication.id}
                                        value={publication.encode()}
                                        onSelect={() => {
                                            setSelectedAccount({ type: 'publication', id: publication.id });
                                            setOpen(false);
                                        }}
                                        className="text-sm truncate"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage
                                                    src={publication.image || ''}
                                                    alt={publication.title || ''}
                                                />
                                                <AvatarFallback>AI</AvatarFallback>
                                            </Avatar>
                                            <span>{publication.title}</span>
                                        </div>
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto h-4 w-4',
                                                selectedAccount?.type === 'publication' &&
                                                    selectedAccount?.id === publication.id
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator />
                        <CommandList>
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => {
                                        // router.push('/publications/new');
                                        // setOpen(false);
                                    }}
                                >
                                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                                    Create Publication
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </Dialog>
    );
}
