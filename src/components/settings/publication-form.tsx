"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/settings/image-upload"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Publication name must be at least 2 characters.",
  }),
  description: z.string().max(500, {
    message: "Description must not be longer than 500 characters.",
  }),
  domain: z.string().optional(),
  avatar: z.string().optional(),
  banner: z.string().optional(),
})

export function PublicationForm() {
  const { addToast } = useToast()

  // Default values for the form
  const defaultValues = {
    name: "Highlighter",
    description: "A platform for sharing your thoughts and ideas with the world.",
    domain: "highlighter.example.com",
    avatar: "/abstract-avatar.png",
    banner: "/abstract-banner.png",
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would save the form data to your backend here
    console.log(values)
    addToast({
      title: "Publication settings updated",
      description: "Your publication settings have been saved successfully.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publication Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your publication name" {...field} />
              </FormControl>
              <FormDescription>This is the name that will be displayed to your readers.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your publication" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                A brief description of your publication. This will be displayed on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Domain</FormLabel>
              <FormControl>
                <Input placeholder="yourdomain.com" {...field} />
              </FormControl>
              <FormDescription>
                Set a custom domain for your publication. Leave blank to use the default subdomain.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar Image</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={field.onChange} aspectRatio="1:1" width={150} height={150} />
              </FormControl>
              <FormDescription>
                This image will be used as your publication&amp;apos;s avatar. Recommended size: 150x150px.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="banner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Image</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={field.onChange} aspectRatio="3:1" width={900} height={300} />
              </FormControl>
              <FormDescription>
                This image will be displayed at the top of your publication. Recommended size: 900x300px.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  )
}
