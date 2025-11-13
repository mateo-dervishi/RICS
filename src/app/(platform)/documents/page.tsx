"use client";

import { useEffect, useState } from "react";
import { getSupabaseWithUserId } from "@/lib/user-helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Document {
  id: string;
  type: string;
  version: string;
  content?: string;
  approval_status: string;
  metadata?: any;
  created_at: string;
}

const documentTypes = [
  { id: "summary-of-experience", label: "Summary of Experience", icon: FileText },
  { id: "case-study", label: "Case Study", icon: FileText },
  { id: "cpd-record", label: "CPD Record", icon: FileText },
  { id: "logbook", label: "Experience Logbook", icon: FileText },
  { id: "application-form", label: "Application Form", icon: FileText }
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const { supabase, userId } = await getSupabaseWithUserId();

      const { data: docsData } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (docsData) {
        setDocuments(docsData);
      }
    } catch (error: any) {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const generateDocument = async (type: string) => {
    try {
      toast.info(`Generating ${type}...`);
      // TODO: Implement document generation logic
      // This would pull data from various tables and format according to RICS templates
      toast.success(`${type} generated successfully!`);
    } catch (error: any) {
      toast.error("Failed to generate document");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: { variant: "outline" as const, icon: Clock },
      "in-review": { variant: "default" as const, icon: Clock },
      approved: { variant: "default" as const, icon: CheckCircle2, className: "bg-green-600" },
      rejected: { variant: "destructive" as const, icon: AlertCircle },
      submitted: { variant: "default" as const, icon: CheckCircle2, className: "bg-blue-600" }
    };

    const config = variants[status] || variants.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="mr-1 h-3 w-3" />
        {status}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Document Preparation Suite</h1>
        <p className="text-muted-foreground">Prepare and manage all your APC submission documents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pre-Submission Checklist</CardTitle>
          <CardDescription>Ensure all required documents are ready for submission</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documentTypes.map((docType) => {
              const doc = documents.find((d) => d.type === docType.id);
              const Icon = docType.icon;
              return (
                <div key={docType.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{docType.label}</p>
                      {doc && (
                        <p className="text-sm text-muted-foreground">
                          Version {doc.version} • {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc ? (
                      <>
                        {getStatusBadge(doc.approval_status)}
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/documents/${doc.id}` as any}>View</Link>
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => generateDocument(docType.id)}>
                        Generate
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="in-review">In Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <DocumentList documents={documents} />
        </TabsContent>
        <TabsContent value="draft">
          <DocumentList documents={documents.filter((d) => d.approval_status === "draft")} />
        </TabsContent>
        <TabsContent value="in-review">
          <DocumentList documents={documents.filter((d) => d.approval_status === "in-review")} />
        </TabsContent>
        <TabsContent value="approved">
          <DocumentList documents={documents.filter((d) => d.approval_status === "approved")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DocumentList({ documents }: { documents: Document[] }) {
  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">No documents found.</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg capitalize">{doc.type.replace(/-/g, " ")}</CardTitle>
              <Badge variant={doc.approval_status === "approved" ? "default" : "outline"}>
                {doc.approval_status}
              </Badge>
            </div>
            <CardDescription>Version {doc.version}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Created: {new Date(doc.created_at).toLocaleDateString()}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href={`/documents/${doc.id}` as any}>View</Link>
              </Button>
              <Button size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

