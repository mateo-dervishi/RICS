"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink, BookOpen, Video, File } from "lucide-react";

const resourceCategories = [
  {
    id: "pathway-guides",
    title: "Pathway Guides",
    description: "Comprehensive guides for each RICS pathway",
    icon: BookOpen,
    resources: [
      { name: "Building Surveying Pathway Guide", type: "PDF", size: "2.4 MB" },
      { name: "Quantity Surveying Pathway Guide", type: "PDF", size: "2.1 MB" },
      { name: "Commercial Real Estate Pathway Guide", type: "PDF", size: "1.9 MB" },
      { name: "Valuation Pathway Guide", type: "PDF", size: "2.3 MB" }
    ]
  },
  {
    id: "rules-of-conduct",
    title: "Rules of Conduct & Ethics",
    description: "RICS professional standards and ethics materials",
    icon: FileText,
    resources: [
      { name: "RICS Rules of Conduct 2021", type: "PDF", size: "1.2 MB" },
      { name: "Ethics Case Studies", type: "PDF", size: "800 KB" },
      { name: "Professional Standards Framework", type: "PDF", size: "1.5 MB" }
    ]
  },
  {
    id: "mandatory-statements",
    title: "Mandatory Professional Statements",
    description: "Required reading for all RICS members",
    icon: File,
    resources: [
      { name: "Valuation Standards (Red Book)", type: "PDF", size: "3.2 MB" },
      { name: "Surveying Safely", type: "PDF", size: "1.8 MB" },
      { name: "Client Money Handling", type: "PDF", size: "950 KB" }
    ]
  },
  {
    id: "assessment-criteria",
    title: "Assessment Criteria",
    description: "Marking schemes and assessment guidance",
    icon: FileText,
    resources: [
      { name: "APC Assessment Criteria", type: "PDF", size: "1.1 MB" },
      { name: "Competency Level Descriptors", type: "PDF", size: "750 KB" },
      { name: "Case Study Marking Scheme", type: "PDF", size: "600 KB" }
    ]
  },
  {
    id: "video-tutorials",
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    icon: Video,
    resources: [
      { name: "How to Write a Summary of Experience", type: "Video", size: "15 min" },
      { name: "Case Study Structure and Best Practices", type: "Video", size: "12 min" },
      { name: "Interview Preparation Tips", type: "Video", size: "20 min" },
      { name: "CPD Recording Best Practices", type: "Video", size: "8 min" }
    ]
  },
  {
    id: "success-tips",
    title: "Success Tips",
    description: "Advice from chartered surveyors",
    icon: BookOpen,
    resources: [
      { name: "Top 10 APC Mistakes to Avoid", type: "PDF", size: "450 KB" },
      { name: "Interview Success Stories", type: "PDF", size: "600 KB" },
      { name: "Time Management for APC Candidates", type: "PDF", size: "520 KB" }
    ]
  }
];

export default function ResourcesPage() {
  const handleDownload = (resourceName: string) => {
    // TODO: Implement actual download functionality
    console.log(`Downloading ${resourceName}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resource Library</h1>
        <p className="text-muted-foreground">Access RICS pathway guides, templates, and learning materials</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {resourceCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.resources.map((resource, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{resource.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{resource.size}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {resource.type === "Video" ? (
                          <Button size="sm" variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Watch
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleDownload(resource.name)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>RICS Assessment Resource Centre (ARC)</CardTitle>
          <CardDescription>Official RICS resources and submission portal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Access the official RICS Assessment Resource Centre for additional materials and submission guidelines.
            </p>
            <Button variant="outline" asChild>
              <a href="https://www.rics.org" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit ARC
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

