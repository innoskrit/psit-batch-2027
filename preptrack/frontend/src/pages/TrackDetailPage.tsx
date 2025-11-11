// src/pages/TrackDetailPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

// shadcn components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { findTrackBySlug } from "@/apis/apis";

type Topic = {
  id: string;
  slug: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  // future: subtopics: Subtopic[]
};

type Track = {
  id: string;
  slug: string;
  name: string;
  description: string;
  isActive: boolean;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
  topics: Topic[];
};

export default function TrackDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    findTrackBySlug(slug)
      .then((res) => setData(res.data as Track))
      .catch((e: unknown) => {
        const msg =
          typeof e === "object" &&
          e !== null &&
          // @ts-ignore
          e.response?.data?.message
            ? // @ts-ignore
              e.response.data.message
            : e instanceof Error
            ? e.message
            : "Error";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (data?.name) document.title = `${data.name} • PrepTrack`;
  }, [data?.name]);

  const topicsSorted = useMemo(
    () =>
      [...(data?.topics ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [data?.topics]
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState />;

  return (
    <div className="container mx-auto max-w-5xl space-y-6 py-6">
      {/* Section 1: Track details */}
      <Card className="bg-muted/30 border-none shadow-sm">
        <CardHeader className="space-y-2 min-h-[10rem] md:min-h-[12rem]">
          <div className="flex items-start justify-between h-full">
            <div className="space-y-2 flex-1 pr-4">
              <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
                {data.name}
              </CardTitle>
              <CardDescription className="mt-1 text-base md:text-lg leading-relaxed">
                {data.description}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {data.isNew && <Badge>New</Badge>}
              {!data.isActive && <Badge variant="destructive">Inactive</Badge>}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Separator />

      {/* Section 2: Topics list with accordion rows; inside: subtopics table placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Topics</CardTitle>
            <div className="text-sm text-muted-foreground">
              {topicsSorted.length} items
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {topicsSorted.length === 0 ? (
            <div className="text-sm text-muted-foreground">No topics yet.</div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {topicsSorted.map((t) => (
                <AccordionItem key={t.id} value={t.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="grid w-full grid-cols-12 gap-4 text-left">
                      <div className="col-span-4 font-medium">{t.name}</div>
                      <div className="col-span-6 text-muted-foreground truncate">
                        {t.description}
                      </div>
                      <div className="col-span-2 flex justify-end gap-2">
                        <Button size="sm" variant="secondary">
                          Open
                        </Button>
                        <Button size="sm">Bookmark</Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="rounded-md border">
                      <div className="p-3 text-xs text-muted-foreground">
                        Subtopics
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[280px]">Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[160px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Replace with real subtopics when API is ready */}
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-muted-foreground"
                            >
                              Subtopics will appear here when the API is
                              available.
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 py-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load track</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-red-600">{message}</CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Not found</CardTitle>
          <CardDescription>No data returned from the server.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
