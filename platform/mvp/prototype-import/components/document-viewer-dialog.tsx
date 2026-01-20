"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/lib/context"
import { updateOpportunityDocument } from "@/lib/mock-api"
import type { OpportunityDocument } from "@/lib/types"
import { Edit, Save, X } from "lucide-react"

interface DocumentViewerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: OpportunityDocument | null
  opportunityId?: string
  mentorId?: string
  onDocumentUpdated?: () => void
}

export function DocumentViewerDialog({ open, onOpenChange, document, opportunityId, mentorId, onDocumentUpdated }: DocumentViewerDialogProps) {
  const { currentUser, currentRole } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedContent, setEditedContent] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (document) {
      setEditedName(document.name)
      setEditedContent(document.content || "")
      // Auto-enable edit mode for new documents (version 0)
      if (document.version === 0) {
        setIsEditing(true)
      } else {
        setIsEditing(false)
      }
    }
  }, [document])

  if (!document) return null

  // Check if user can edit: must be mentor of opportunity OR analyst role
  const canEdit = currentUser && (
    (currentRole === "mentor" && mentorId === currentUser.id) ||
    currentRole === "analyst"
  )

  const isNewDocument = document.version === 0

  const handleSave = async () => {
    if (!currentUser || !opportunityId) return

    setSaving(true)
    try {
      const documentType = document.type === "ideation" ? "ideation" : "businessCase"
      await updateOpportunityDocument(
        opportunityId,
        documentType,
        { name: editedName, content: editedContent },
        currentUser.id,
        currentUser.name
      )
      
      setIsEditing(false)
      if (onDocumentUpdated) {
        onDocumentUpdated()
      }
      // Close dialog after save to allow fresh data to load
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update document:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedName(document.name)
    setEditedContent(document.content || "")
    setIsEditing(false)
  }

  // Simple markdown-to-HTML converter for basic formatting
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n')
    const elements: JSX.Element[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []
    let listItems: string[] = []
    let inList = false

    lines.forEach((line, index) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="bg-slate-100 p-3 rounded-md my-3 overflow-x-auto">
              <code className="text-sm font-mono">{codeBlockContent.join('\n')}</code>
            </pre>
          )
          codeBlockContent = []
        }
        inCodeBlock = !inCodeBlock
        return
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        return
      }

      // Close list if needed
      if (inList && !line.trim().startsWith('-') && !line.trim().startsWith('*')) {
        elements.push(
          <ul key={`list-${index}`} className="list-disc list-inside space-y-1 my-3 ml-4">
            {listItems.map((item, i) => (
              <li key={i} className="text-sm leading-relaxed">{item}</li>
            ))}
          </ul>
        )
        listItems = []
        inList = false
      }

      // Headers
      if (line.startsWith('#### ')) {
        elements.push(<h4 key={index} className="text-base font-semibold mt-4 mb-2 text-slate-800">{line.replace('#### ', '')}</h4>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={index} className="text-lg font-semibold mt-5 mb-2 text-slate-800">{line.replace('### ', '')}</h3>)
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={index} className="text-xl font-bold mt-6 mb-3 text-slate-900">{line.replace('## ', '')}</h2>)
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-slate-900">{line.replace('# ', '')}</h1>)
      }
      // Lists
      else if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        inList = true
        listItems.push(line.trim().substring(1).trim())
      }
      // Bold text
      else if (line.includes('**')) {
        const formatted = line.split('**').map((part, i) => 
          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        )
        elements.push(<p key={index} className="text-sm leading-relaxed my-2">{formatted}</p>)
      }
      // Regular paragraphs
      else if (line.trim()) {
        elements.push(<p key={index} className="text-sm leading-relaxed my-2">{line}</p>)
      }
      // Empty lines
      else {
        elements.push(<div key={index} className="h-2" />)
      }
    })

    // Close any remaining list
    if (inList) {
      elements.push(
        <ul key="list-final" className="list-disc list-inside space-y-1 my-3 ml-4">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed">{item}</li>
          ))}
        </ul>
      )
    }

    return elements
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-full max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEditing ? (
              <div className="flex-1 mr-4">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-lg font-semibold"
                />
              </div>
            ) : (
              <span>{document.name}</span>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {isNewDocument ? "New" : `v${document.version}`}
              </Badge>
              {canEdit && !isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            {isNewDocument ? (
              <span className="text-sm text-muted-foreground">Create a new {document.type === "ideation" ? "ideation" : "business case"} document</span>
            ) : (
              <>
                Last updated {new Date(document.lastModified).toLocaleDateString()} by {document.lastModifiedByName || document.uploadedByName}
                {document.lastModifiedBy && document.uploadedBy !== document.lastModifiedBy && (
                  <span className="text-xs text-muted-foreground ml-2">(originally created by {document.uploadedByName})</span>
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {isEditing ? (
          <ScrollArea className="h-[calc(85vh-240px)]">
            <div className="space-y-4 pb-4 pr-4">
              <div className="space-y-2">
                <Label htmlFor="docContent">Content (Markdown supported)</Label>
                <Textarea
                  id="docContent"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={25}
                  className="font-mono text-sm resize-none w-full"
                  placeholder="Enter document content using markdown formatting..."
                />
                <p className="text-xs text-muted-foreground">
                  Supports: # Headers, **bold**, - lists, ```code blocks```
                </p>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <ScrollArea className="h-[calc(85vh-180px)]">
            <div className="prose prose-sm max-w-none pr-4">
              {document.content ? (
                <div className="space-y-1">{renderMarkdown(document.content)}</div>
              ) : document.url ? (
                <div className="text-center py-8">
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Open External Document
                  </a>
                </div>
              ) : (
                <p className="text-muted-foreground">No content available</p>
              )}
            </div>
          </ScrollArea>
        )}

        {isEditing && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !editedName.trim() || !editedContent.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : isNewDocument ? "Create Document" : "Save Changes"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
