import { PaymentsForm } from "@/components/settings/payments-form"

export default function PaymentsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Payment Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure subscription plans and payment options for your publication.
        </p>
      </div>
      <div className="space-y-8">
        <PaymentsForm />
      </div>
    </div>
  )
}
