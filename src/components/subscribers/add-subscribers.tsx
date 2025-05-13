"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

const emailSchema = z.object({
  emails: z
    .string()
    .min(1, { message: "Please enter at least one email address" })
    .refine(
      (value) => {
        const emails = value.split(",").map((email) => email.trim())
        return emails.every((email) => email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      },
      { message: "Please enter valid email addresses separated by commas" },
    ),
  tier: z.string(),
  sendWelcomeEmail: z.boolean().default(true),
})

const npubSchema = z.object({
  npubs: z
    .string()
    .min(1, { message: "Please enter at least one Nostr npub" })
    .refine(
      (value) => {
        const npubs = value.split(",").map((npub) => npub.trim())
        return npubs.every((npub) => npub === "" || npub.startsWith("npub1"))
      },
      { message: "Please enter valid Nostr npubs separated by commas" },
    ),
  tier: z.string(),
  sendWelcomeEmail: z.boolean().default(false),
})

export function AddSubscribers() {
  const [activeTab, setActiveTab] = useState("email")
  const { toast } = useToast()

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      emails: "",
      tier: "free",
      sendWelcomeEmail: true,
    },
  })

  const npubForm = useForm<z.infer<typeof npubSchema>>({
    resolver: zodResolver(npubSchema),
    defaultValues: {
      npubs: "",
      tier: "free",
      sendWelcomeEmail: false,
    },
  })

  function onEmailSubmit(_: z.infer<typeof emailSchema>) {
    toast({
      title: "Subscribers added",
      description: "The email subscribers have been added successfully.",
    })
    emailForm.reset({
      emails: "",
      tier: "free",
      sendWelcomeEmail: true,
    })
  }

  function onNpubSubmit(values: z.infer<typeof npubSchema>) {
    toast({
      title: "Subscribers added",
      description: "The Nostr subscribers have been added successfully.",
    })
    npubForm.reset({
      npubs: "",
      tier: "free",
      sendWelcomeEmail: false,
    })
  }

  return (
    <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="email">Add by Email</TabsTrigger>
        <TabsTrigger value="npub">Add by Nostr npub</TabsTrigger>
      </TabsList>

      <TabsContent value="email">
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Add subscribers by email</h2>

          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
              <FormField
                control={emailForm.control}
                name="emails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Addresses</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter email addresses (comma separated)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter one or more email addresses, separated by commas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={emailForm.control}
                name="tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Tier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subscription tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">Free subscription</SelectItem>
                        <SelectItem value="paid">Paid subscription</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the subscription tier for these subscribers.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={emailForm.control}
                name="sendWelcomeEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Send welcome email</FormLabel>
                      <FormDescription>Send a welcome email to new subscribers.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Add emails
              </Button>
            </form>
          </Form>
        </div>
      </TabsContent>

      <TabsContent value="npub">
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Add subscribers by Nostr npub</h2>

          <Form {...npubForm}>
            <form onSubmit={npubForm.handleSubmit(onNpubSubmit)} className="space-y-6">
              <FormField
                control={npubForm.control}
                name="npubs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nostr npubs</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Nostr npubs (comma separated)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter one or more Nostr npubs, separated by commas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={npubForm.control}
                name="tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Tier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subscription tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">Free subscription</SelectItem>
                        <SelectItem value="paid">Paid subscription</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the subscription tier for these subscribers.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={npubForm.control}
                name="sendWelcomeEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Send welcome email</FormLabel>
                      <FormDescription>Send a welcome email to subscribers who have an email address.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Add Nostr subscribers
              </Button>
            </form>
          </Form>
        </div>
      </TabsContent>
    </Tabs>
  )
}
