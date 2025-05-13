"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  enablePaidSubscriptions: z.boolean(),
  currency: z.enum(["sats", "USD", "EUR"]),
  monthlyPrice: z.string().optional(),
  annualPrice: z.string().optional(),
  stripeConnected: z.boolean(),
})

export function PaymentsForm() {
  const { addToast } = useToast()
  const [enablePaidSubscriptions, setEnablePaidSubscriptions] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<"sats" | "USD" | "EUR">("sats")

  // Default values for the form
  const defaultValues: z.infer<typeof formSchema> = {
    enablePaidSubscriptions: false,
    currency: "sats",
    monthlyPrice: "10000",
    annualPrice: "100000",
    stripeConnected: false,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would save the form data to your backend here
    console.log(values)
    addToast({
      title: "Payment settings updated",
      description: "Your payment settings have been saved successfully.",
    })
  }

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$"
      case "EUR":
        return "€"
      case "sats":
        return "₿"
      default:
        return ""
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="enablePaidSubscriptions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Paid Subscriptions</FormLabel>
                <FormDescription>Allow readers to subscribe to your publication for a fee.</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    setEnablePaidSubscriptions(checked)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {enablePaidSubscriptions && (
          <>
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={(value: "sats" | "USD" | "EUR") => {
                      field.onChange(value)
                      setSelectedCurrency(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sats">Bitcoin (sats)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the currency for your subscription plans.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="monthlyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        {selectedCurrency !== "sats" && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {getCurrencySymbol(selectedCurrency)}
                          </span>
                        )}
                        <Input
                          {...field}
                          type="text"
                          placeholder={selectedCurrency === "sats" ? "10000" : "5.00"}
                          className={selectedCurrency !== "sats" ? "pl-7" : ""}
                        />
                        {selectedCurrency === "sats" && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">sats</span>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>The price for a monthly subscription.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="annualPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        {selectedCurrency !== "sats" && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {getCurrencySymbol(selectedCurrency)}
                          </span>
                        )}
                        <Input
                          {...field}
                          type="text"
                          placeholder={selectedCurrency === "sats" ? "100000" : "50.00"}
                          className={selectedCurrency !== "sats" ? "pl-7" : ""}
                        />
                        {selectedCurrency === "sats" && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">sats</span>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      The price for an annual subscription. Consider offering a discount compared to the monthly price.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment Processor</CardTitle>
                <CardDescription>Connect your payment processor to receive payments.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="stripeConnected"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Connect Stripe</FormLabel>
                        <FormDescription>Connect your Stripe account to process credit card payments.</FormDescription>
                      </div>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                          {!field.value && (
                            <Button variant="outline" size="sm">
                              Connect
                            </Button>
                          )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {selectedCurrency === "sats" && (
                  <>
                    <Separator className="my-4" />
                    <div className="rounded-lg border p-4">
                      <h4 className="mb-2 font-medium">Bitcoin Lightning</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        For Bitcoin payments, you&amp;apos;ll need to set up a Lightning address.
                      </p>
                      <Button variant="outline" size="sm">
                        Configure Lightning
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  )
}
