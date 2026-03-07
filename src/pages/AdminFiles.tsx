import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { Upload, Trash2, FolderOpen, Image, FileText, Film, Music, File, X, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const getFileIcon = (type: string) => {
  if (type?.startsWith('image/')) return <Image size={20} className="text-blue-500" />;
  if (type?.startsWith('video/')) return <Film size={20} className="text-purple-500" />;
  if (type?.startsWith('audio/')) return <Music size={20} className="text-green-500" />;
  if (type?.includes('pdf') || type?.includes('document')) return <FileText size={20} className="text-red-500" />;
  return <File size={20} className="text-gray-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const AdminFiles = () => {
  const queryClient = useQueryClient();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const { data: folders = [] } = useQuery({
    queryKey: ["file-folders"],
    queryFn: filesApi.getFolders,
  });

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["files", selectedFolder],
    queryFn: () => filesApi.getAll(selectedFolder || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: filesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["file-folders"] });
      toast.success("File deleted");
      setSelectedFile(null);
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    try {
      const folder = newFolder || selectedFolder || "general";
      if (fileList.length === 1) {
        await filesApi.upload(fileList[0], folder);
      } else {
        await filesApi.uploadMultiple(Array.from(fileList), folder);
      }
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["file-folders"] });
      toast.success(`${fileList.length} file(s) uploaded`);
      setNewFolder("");
      setShowNewFolder(false);
    } catch (err: any) {
      toast.error(err.message);
    }
    setUploading(false);
    e.target.value = "";
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const allFolders = ["general", ...folders.filter((f: any) => f.folder !== "general").map((f: any) => f.folder)];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">File Manager</h1>
            <p className="text-sm text-muted-foreground">Upload and manage your media files</p>
          </div>
          <div className="flex gap-2">
            {showNewFolder && (
              <input
                type="text"
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                placeholder="New folder name"
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              />
            )}
            <button
              onClick={() => setShowNewFolder(!showNewFolder)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm"
            >
              <FolderOpen size={16} className="inline mr-1" />
              {showNewFolder ? "Cancel" : "New Folder"}
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer">
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload Files"}
              <input
                type="file"
                multiple
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Folders */}
          <div className="w-48 shrink-0">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Folders</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  selectedFolder === null ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
              >
                All Files
              </button>
              {allFolders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                    selectedFolder === folder ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <FolderOpen size={14} />
                  {folder}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content - Files Grid */}
          <div className="flex-1">
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : files.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No files yet. Upload some files to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {files.map((file: any) => (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedFile?.id === file.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {file.file_type?.startsWith("image/") ? (
                      <img
                        src={file.file_path}
                        alt={file.original_name}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-24 bg-muted rounded mb-2 flex items-center justify-center">
                        {getFileIcon(file.file_type)}
                      </div>
                    )}
                    <p className="text-xs font-medium truncate" title={file.original_name}>
                      {file.original_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file_size)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Details Sidebar */}
          {selectedFile && (
            <div className="w-72 shrink-0 border-l border-border pl-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">File Details</h3>
                <button onClick={() => setSelectedFile(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
              
              {selectedFile.file_type?.startsWith("image/") && (
                <img
                  src={selectedFile.file_path}
                  alt={selectedFile.original_name}
                  className="w-full rounded-lg mb-4"
                />
              )}
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium truncate">{selectedFile.original_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p>{formatFileSize(selectedFile.file_size)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p>{selectedFile.file_type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Folder</p>
                  <p>{selectedFile.folder}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uploaded</p>
                  <p>{format(new Date(selectedFile.created_at), "MMM d, yyyy HH:mm")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">URL</p>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={selectedFile.file_path}
                      readOnly
                      className="flex-1 px-2 py-1 text-xs bg-muted rounded border-0"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedFile.file_path)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {copiedUrl === selectedFile.file_path ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (confirm("Delete this file?")) {
                    deleteMutation.mutate(selectedFile.id);
                  }
                }}
                className="w-full mt-6 px-4 py-2 text-sm text-destructive border border-destructive rounded-lg hover:bg-destructive/10"
              >
                <Trash2 size={14} className="inline mr-1" />
                Delete File
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFiles;
