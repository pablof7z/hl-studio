"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Upload, FileUp, FileText } from "lucide-react"

export function ImportSubscribers() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)
  const [tier, setTier] = useState("free")
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    const validExtensions = [".csv", ".xlsx", ".ods"]
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

    if (validExtensions.includes(fileExtension)) {
      setFile(file)
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a .csv, .xlsx, or .ods file.",
        variant: "destructive",
      })
    }
  }

  const handleImport = () => {
    if (!file) return

    toast({
      title: "Import started",
      description: `Importing subscribers from ${file.name}`,
    })

    // Simulate import process
    setTimeout(() => {
      toast({
        title: "Import successful",
        description: "42 subscribers have been imported successfully.",
      })
      setFile(null)
    }, 2000)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Add subscribers by upload</h2>
        <p className="text-muted-foreground">
          Import existing subscribers from platforms like{" "}
          <a href="#" className="text-primary underline">
            Patreon
          </a>
          ,{" "}
          <a href="#" className="text-primary underline">
            Ghost
          </a>
          ,{" "}
          <a href="#" className="text-primary underline">
            Mailchimp
          </a>
          , or{" "}
          <a href="#" className="text-primary underline">
            TinyLetter
          </a>
          .
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
              Remove file
            </Button>
          </div>
        ) : (
          <>
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Drag files here to upload</h3>
            <p className="mt-2 text-sm text-muted-foreground">Add a .csv, .xlsx, or .ods file</p>
            <div className="mt-6">
              <label htmlFor="file-upload">
                <Button variant="outline" size="sm" className="cursor-pointer" as="span">
                  <FileUp className="mr-2 h-4 w-4" />
                  Choose file
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.ods"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </>
        )}
      </div>

      {file && (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="tier">Subscription Tier</Label>
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger id="tier">
                <SelectValue placeholder="Select a subscription tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free subscription</SelectItem>
                <SelectItem value="paid">Paid subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="welcome-email"
              checked={sendWelcomeEmail}
              onCheckedChange={(checked) => setSendWelcomeEmail(checked as boolean)}
            />
            <Label htmlFor="welcome-email" className="cursor-pointer">
              Send welcome email to new subscribers
            </Label>
          </div>

          <Button onClick={handleImport} className="w-full">
            Import Subscribers
          </Button>
        </div>
      )}
    </div>
  )
}
