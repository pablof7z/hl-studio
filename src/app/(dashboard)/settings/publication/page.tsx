import { PublicationForm } from "@/components/settings/publication-form"

export default function PublicationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Publication Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your publication details and appearance.</p>
      </div>
      <div className="space-y-8">
        <PublicationForm />
      </div>
    </div>
  )
}
