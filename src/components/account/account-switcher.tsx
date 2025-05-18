"use client"

import * as React from "react"
import { useEffect } from "react"
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent, DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { usePinnedGroupsStore } from "@/domains/groups/stores/pinned-groups"
import { useNDK, useNDKCurrentPubkey, useProfileValue } from "@nostr-dev-kit/ndk-hooks"
import { useMyGroups } from "@/domains/groups/hooks/use-my-groups"
import { useAccountStore } from "@/domains/account/stores/accountStore"
import UserAvatar from "@/features/nostr/components/user/UserAvatar"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

type AccountSwitcherProps = PopoverTriggerProps & {
  className?: string
}

export function AccountSwitcher({ className }: AccountSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [showNewAccountDialog, setShowNewAccountDialog] = React.useState(false)
  const currentPubkey = useNDKCurrentPubkey();
  const listPinnedGroups = usePinnedGroupsStore((state) => state.listPinnedGroups);
  const myGroups = useMyGroups();
  const { ndk } = useNDK();
  const userProfile = useProfileValue(currentPubkey);
  const selectedAccount = useAccountStore((state) => state.selectedAccount)
  const setSelectedAccount = useAccountStore((state) => state.setSelectedAccount)

  React.useEffect(() => {
    if (!currentPubkey || !ndk) return;
    listPinnedGroups(ndk, [currentPubkey]);
  }, [currentPubkey])

  React.useEffect(() => {
    // set default selectedAccount to current user if not set
    if (currentPubkey && !selectedAccount) {
      setSelectedAccount({ type: 'user', id: currentPubkey })
    }
  }, [currentPubkey, selectedAccount, setSelectedAccount])

  return (
    <Dialog open={showNewAccountDialog} onOpenChange={setShowNewAccountDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select an account"
            className={cn("w-[220px] justify-between", className)}
          >
            <div className="flex items-center gap-2">
              {selectedAccount ? (
                selectedAccount.type === 'user' ? (
                  <>
                    <UserAvatar pubkey={selectedAccount.id} size={"xs"} alt={userProfile?.displayName || ''} />
                    <span className="font-medium">{userProfile?.displayName ?? selectedAccount.id}</span>
                  </>
                ) : (
                  (() => {
                    const group = myGroups.find(g => g.groupId === selectedAccount.id)
                    return group ? (
                      <>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={group.metadata?.picture || ''} alt={group.metadata?.name || ''} />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{group.metadata?.name ?? group.groupId}</span>
                      </>
                    ) : (
                      <>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={'/letter-a-abstract.png'} alt="" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{selectedAccount.id}</span>
                      </>
                    )
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
                    setSelectedAccount({ type: 'user', id: currentPubkey! })
                    setOpen(false)
                  }}
                  className="text-sm"
                >
                  <div className="flex items-center gap-2">
                    <UserAvatar pubkey={currentPubkey} size="xs" alt={userProfile?.displayName || ''} />
                    <span>
                      {userProfile?.displayName ?? currentPubkey}
                    </span>
                  </div>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedAccount?.type === 'user' && selectedAccount?.id === currentPubkey ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Publications" className="overflow-auto">
                {myGroups.map((group) => (
                  <CommandItem
                    key={group.groupId}
                    value={group.groupId}
                    onSelect={() => {
                      setSelectedAccount({ type: 'publication', id: group.groupId })
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={group.metadata?.picture || ''} alt={group.metadata?.name || ''} />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <span>
                        {group.metadata?.name ?? group.groupId}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedAccount?.type === 'publication' && selectedAccount?.id === group.groupId ? "opacity-100" : "opacity-0",
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
                    setOpen(false)
                    setShowNewAccountDialog(true)
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Publication</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Acme Inc." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="domain">Domain</Label>
            <Input id="domain" placeholder="acme" />
            <span className="text-xs text-muted-foreground">This will be used in your publication URL</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewAccountDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowNewAccountDialog(false)}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
