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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { usePinnedGroupsStore } from "@/domains/groups/stores/pinned-groups"
import { useNDK, useNDKCurrentPubkey, useProfileValue } from "@nostr-dev-kit/ndk-hooks"
import { list } from "postcss"
import { useMyGroups } from "@/domains/groups/hooks/use-my-groups"
import { NostrAvatar } from "@/ui"

type Account = {
  label: string
  value: string
  icon: React.ReactNode
}

const accounts: Account[] = [
  {
    label: "Acme Inc",
    value: "acme-inc",
    icon: (
      <Avatar className="h-6 w-6">
        <AvatarImage src="/letter-a-abstract.png" alt="Acme Inc" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
    ),
  },
  {
    label: "Highlighter",
    value: "highlighter",
    icon: (
      <Avatar className="h-6 w-6">
        <AvatarImage src="/letter-h-typography.png" alt="Highlighter" />
        <AvatarFallback>H</AvatarFallback>
      </Avatar>
    ),
  },
  {
    label: "Personal Blog",
    value: "personal-blog",
    icon: (
      <Avatar className="h-6 w-6">
        <AvatarImage src="/letter-p-typography.png" alt="Personal Blog" />
        <AvatarFallback>PB</AvatarFallback>
      </Avatar>
    ),
  },
]

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

type AccountSwitcherProps = PopoverTriggerProps & {
  className?: string
}

export function AccountSwitcher({ className }: AccountSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [showNewAccountDialog, setShowNewAccountDialog] = React.useState(false)
  const [selectedAccount, setSelectedAccount] = React.useState<Account>(accounts[1])
  const currentPubkey = useNDKCurrentPubkey();
  const listPinnedGroups = usePinnedGroupsStore((state) => state.listPinnedGroups);
  const myGroups = useMyGroups();
  const { ndk } = useNDK();
  const userProfile = useProfileValue(currentPubkey);

  useEffect(() => {
    if (!currentPubkey || !ndk) return;

    listPinnedGroups(ndk, [currentPubkey]);
  }, [currentPubkey])

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
              {selectedAccount.icon}
              <span className="font-medium">{selectedAccount.label}</span>
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
                    onSelect={() => {
                      setSelectedAccount({
                        label: currentPubkey,
                        value: currentPubkey,
                        icon: (
                          <NostrAvatar pubkey={currentPubkey} size={32} className="h-6 w-6" alt="User" />
                        ),
                      })
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <NostrAvatar pubkey={currentPubkey} size={32} className="h-6 w-6" alt="User" />
                      <span>
                        {userProfile?.displayName ?? currentPubkey}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedAccount.value === currentPubkey ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Publications" className="overflow-auto">
                {myGroups.map((group) => (
                  <CommandItem
                    key={group.groupId}
                    onSelect={() => {
                      setSelectedAccount({
                        label: group.metadata?.name ?? group.groupId,
                        value: group.metadata?.name ?? group.groupId,
                        icon: (
                          <Avatar className="h-6 w-6">
        <AvatarImage src="/letter-a-abstract.png" alt="Acme Inc" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
                        ),
                      })
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={group.metadata?.picture ?? '/letter-a-abstract.png'} alt="Acme Inc" />
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                      <span>
                        {group.metadata?.name ?? group.groupId}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedAccount.value === group.groupId ? "opacity-100" : "opacity-0",
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
