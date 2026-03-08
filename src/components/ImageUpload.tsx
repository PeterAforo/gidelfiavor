import { useState, useRef } from "react";
import { filesApi, resolveImageUrl } from "@/lib/api";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  multiple?: boolean;
  onMultipleUpload?: (urls: string[]) => void;
  className?: string;
  placeholder?: string;
}

const ImageUpload = ({
  value,
  onChange,
  folder = "images",
  multiple = false,
  onMultipleUpload,
  className = "",
  placeholder = "Click or drag to upload",
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      if (multiple && files.length > 1) {
        const result = await filesApi.uploadMultiple(Array.from(files), folder);
        const urls = result.map((f: any) => f.url);
        onMultipleUpload?.(urls);
        toast.success(`${files.length} images uploaded`);
      } else {
        const result = await filesApi.upload(files[0], folder);
        onChange(result.url);
        toast.success("Image uploaded");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const clearImage = () => {
    onChange("");
  };

  return (
    <div className={className}>
      {value ? (
        <div className="relative inline-block">
          <img
            src={resolveImageUrl(value)}
            alt="Uploaded"
            className="max-w-full h-auto max-h-48 rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
            ${uploading ? "pointer-events-none opacity-50" : ""}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={32} className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">{placeholder}</p>
              <p className="text-xs text-muted-foreground">
                {multiple ? "Multiple files supported" : "PNG, JPG, GIF up to 10MB"}
              </p>
            </div>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleUpload(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
