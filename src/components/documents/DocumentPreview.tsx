"use client";

import { useState } from "react";
import { ExternalLink, Eye, LoaderCircle } from "lucide-react";
import { getDocumentViewUrl } from "@/lib/api";
import type { DocumentType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface DocumentPreviewProps {
  applicationId: string;
  type: DocumentType;
  fileName: string;
}

export function DocumentPreview({ applicationId, type, fileName }: DocumentPreviewProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPreview = async () => {
    setLoading(true);
    setError(null);
    try {
      setUrl(await getDocumentViewUrl(applicationId, type));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not open this document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="button" size="sm" variant="secondary" onClick={() => void openPreview()} disabled={loading}>
        {loading ? <LoaderCircle size={14} className="mr-1 inline animate-spin" /> : <Eye size={14} className="mr-1 inline" />}
        {loading ? "Loading…" : "View document"}
      </Button>
      {error && <p role="alert" className="mt-2 text-xs text-rose-700">{error}</p>}
      <Modal open={Boolean(url)} onClose={() => setUrl(null)} title={fileName}>
        {url && (
          <div>
            <div className="mb-3 flex justify-end">
              <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                Open in new tab <ExternalLink size={14} />
              </a>
            </div>
            <iframe title={`Preview of ${fileName}`} src={url} className="h-[65vh] w-full rounded-lg border border-slate-200" />
          </div>
        )}
      </Modal>
    </>
  );
}
