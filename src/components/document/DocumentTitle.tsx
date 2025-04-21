import { Document } from "@/models/document";
import DocumentStatusBadge from "./DocumentStatusBadge";

interface DocumentTitleProps {
  document: Document | undefined;
  isLoading: boolean;
}

const DocumentTitle = ({ document, isLoading }: DocumentTitleProps) => {
  return (
    <div className="flex items-center">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          {isLoading ? "Loading..." : document?.title}
          {document && <DocumentStatusBadge status={document.status} />}
        </h1>
        {document && (
          <div className="flex items-center gap-2 text-blue-300/80 mt-1">
            <span className="font-mono text-xs">{document.documentKey}</span>
            <span className="text-blue-400/50">•</span>
            <span className="text-sm">{document.documentType.typeName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentTitle;
