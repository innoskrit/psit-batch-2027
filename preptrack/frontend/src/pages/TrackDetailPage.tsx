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
import { Code, FileText, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

type SubTopic = {
  id: string;
  name: string;
  subtopicUrl: string | null;
  articleUrl: string | null;
  videoUrl: string | null;
  difficulty: string;
  createdAt: string;
  updatedAt: string;
};

type Topic = {
  id: string;
  slug: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  subtopics: SubTopic[];
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
  const { isAuthenticated, userSession } = useAuth();

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

  const handleMarkCompleteButton = () => {
    if (isAuthenticated) {
      // TODO: Call backend API to mark subtopic as complete for this user
      console.log(
        "The topic is marked as completed for user " + userSession?.email
      );
    } else {
      toast.warning("Please sign in", {
        description: (
          <span className="block text-left">
            Please{" "}
            <a
              href="/signin"
              className="underline underline-offset-4 font-medium"
            >
              sign in
            </a>{" "}
            if you want to mark this topic complete.
          </span>
        ),
      });
    }
  };

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
            <div className="flex gap-2">{data.isNew && <Badge>New</Badge>}</div>
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
                      <div className="p-3 text-xs text-left text-muted-foreground">
                        Subtopics
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[220px]">Name</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Resources</TableHead>
                            <TableHead className="w-[160px] text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {t.subtopics && t.subtopics.length > 0 ? (
                            t.subtopics.map((subTopic) => (
                              <TableRow key={subTopic.id}>
                                <TableCell className="font-medium text-left">
                                  {subTopic.name}
                                </TableCell>
                                <TableCell className="capitalize text-sm text-left text-muted-foreground">
                                  {subTopic.difficulty}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <ResourceIcon
                                      url={subTopic.subtopicUrl}
                                      label="View problem"
                                      icon={Code}
                                    />
                                    <ResourceIcon
                                      url={subTopic.articleUrl}
                                      label="Read article"
                                      icon={FileText}
                                    />
                                    <ResourceIcon
                                      url={subTopic.videoUrl}
                                      label="Watch video"
                                      icon={Video}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    onClick={handleMarkCompleteButton}
                                    size="sm"
                                    variant="outline"
                                  >
                                    Mark Complete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-muted-foreground"
                              >
                                No subtopics yet.
                              </TableCell>
                            </TableRow>
                          )}
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

type ResourceIconProps = {
  url: string | null;
  label: string;
  icon: LucideIcon;
};

const ResourceIcon = ({ url, label, icon: Icon }: ResourceIconProps) => {
  if (url) {
    return (
      <Button variant="ghost" size="icon" asChild>
        <a href={url} target="_blank" rel="noreferrer" aria-label={label}>
          <Icon className="h-4 w-4" />
        </a>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" disabled aria-label={label}>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
};
