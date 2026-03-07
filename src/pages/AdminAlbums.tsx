import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { albumsApi, filesApi } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import ImageUpload from "@/components/ImageUpload";
import { Plus, Edit2, Trash2, Image, Video, FolderOpen, X, Upload } from "lucide-react";
import { toast } from "sonner";

const AdminAlbums = () => {
  const queryClient = useQueryClient();
  const [editingAlbum, setEditingAlbum] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  
  // Form state for album
  const [albumForm, setAlbumForm] = useState({
    title: "",
    description: "",
    cover_url: "",
    sort_order: 0,
  });
  
  // Form state for media
  const [mediaForm, setMediaForm] = useState({
    media_url: "",
    media_type: "image",
    caption: "",
    sort_order: 0,
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: albums = [], isLoading } = useQuery({
    queryKey: ["albums"],
    queryFn: albumsApi.getAll,
  });

  const { data: albumDetail } = useQuery({
    queryKey: ["album", selectedAlbum?.id],
    queryFn: () => albumsApi.getById(selectedAlbum.id),
    enabled: !!selectedAlbum,
  });

  const createMutation = useMutation({
    mutationFn: albumsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      setIsModalOpen(false);
      setEditingAlbum(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => albumsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      setIsModalOpen(false);
      setEditingAlbum(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: albumsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      setSelectedAlbum(null);
    },
  });

  const addMediaMutation = useMutation({
    mutationFn: ({ albumId, data }: { albumId: string; data: any }) => albumsApi.addMedia(albumId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album", selectedAlbum?.id] });
      setIsMediaModalOpen(false);
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: albumsApi.deleteMedia,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["album", selectedAlbum?.id] }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!albumForm.title) {
      toast.error("Title is required");
      return;
    }

    if (editingAlbum) {
      updateMutation.mutate({ id: editingAlbum.id, data: albumForm });
    } else {
      createMutation.mutate(albumForm);
    }
  };

  const handleMediaSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mediaForm.media_url) {
      toast.error("Media is required");
      return;
    }
    addMediaMutation.mutate({ albumId: selectedAlbum.id, data: mediaForm });
  };

  const handleMultipleUpload = async (files: FileList) => {
    if (!selectedAlbum) return;
    setUploading(true);
    const currentMediaCount = albumDetail?.media?.length || 0;
    let successCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await filesApi.upload(files[i], 'albums');
        if (result.url) {
          await addMediaMutation.mutateAsync({
            albumId: selectedAlbum.id,
            data: {
              media_url: result.url,
              media_type: 'image',
              caption: files[i].name.replace(/\.[^.]+$/, ''),
              sort_order: currentMediaCount + i,
            },
          });
          successCount++;
        }
      } catch (err: any) {
        toast.error(`Failed to upload ${files[i].name}`);
      }
    }
    
    setUploading(false);
    if (successCount > 0) {
      toast.success(`${successCount} image${successCount > 1 ? 's' : ''} uploaded successfully!`);
      queryClient.invalidateQueries({ queryKey: ["album", selectedAlbum.id] });
    }
  };

  const openModal = (album?: any) => {
    if (album) {
      setAlbumForm({
        title: album.title || "",
        description: album.description || "",
        cover_url: album.cover_url || "",
        sort_order: album.sort_order || 0,
      });
      setEditingAlbum(album);
    } else {
      setAlbumForm({ title: "", description: "", cover_url: "", sort_order: 0 });
      setEditingAlbum(null);
    }
    setIsModalOpen(true);
  };
  
  const openMediaModal = () => {
    setMediaForm({ media_url: "", media_type: "image", caption: "", sort_order: 0 });
    setIsMediaModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Albums</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus size={18} /> Add Album
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Albums List */}
          <div className="lg:col-span-1">
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-3">
                {albums.map((album: any) => (
                  <div
                    key={album.id}
                    onClick={() => setSelectedAlbum(album)}
                    className={`bg-card rounded-lg border p-4 cursor-pointer transition-colors group ${
                      selectedAlbum?.id === album.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {album.cover_url ? (
                        <img
                          src={album.cover_url}
                          alt={album.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <FolderOpen size={20} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{album.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {album.description || "No description"}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); openModal(album); }}
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded"
                          title="Edit Album"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Delete this album and all its media?")) {
                              deleteMutation.mutate(album.id);
                            }
                          }}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted rounded"
                          title="Delete Album"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {albums.length === 0 && (
                  <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground">
                    No albums yet
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Album Detail */}
          <div className="lg:col-span-2">
            {selectedAlbum ? (
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedAlbum.title}</h2>
                    <p className="text-muted-foreground">{selectedAlbum.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(selectedAlbum)}
                      className="p-2 text-muted-foreground hover:text-primary"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this album and all its media?")) {
                          deleteMutation.mutate(selectedAlbum.id);
                        }
                      }}
                      className="p-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Media</h3>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 cursor-pointer">
                      <Upload size={14} /> Upload Multiple
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => e.target.files && handleMultipleUpload(e.target.files)}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={openMediaModal}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded hover:bg-muted"
                    >
                      <Plus size={14} /> Add Single
                    </button>
                  </div>
                </div>

                {uploading && (
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg text-sm text-primary">
                    Uploading images... Please wait.
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {albumDetail?.media?.map((media: any) => (
                    <div key={media.id} className="relative group">
                      {media.media_type === "video" ? (
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <Video size={32} className="text-muted-foreground" />
                          <span className="absolute bottom-2 left-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
                            Video
                          </span>
                        </div>
                      ) : (
                        <img
                          src={media.media_url}
                          alt={media.caption || ""}
                          className="aspect-square object-cover rounded-lg"
                        />
                      )}
                      <button
                        onClick={() => {
                          if (confirm("Delete this media?")) {
                            deleteMediaMutation.mutate(media.id);
                          }
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      {media.caption && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{media.caption}</p>
                      )}
                    </div>
                  ))}
                  {(!albumDetail?.media || albumDetail.media.length === 0) && (
                    <div className="col-span-full py-8 text-center text-muted-foreground">
                      No media in this album yet
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground">
                Select an album to view its media
              </div>
            )}
          </div>
        </div>

        {/* Album Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">
                {editingAlbum ? "Edit Album" : "Add Album"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    value={albumForm.title}
                    onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={albumForm.description}
                    onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cover Image</label>
                  <ImageUpload
                    value={albumForm.cover_url}
                    onChange={(url) => setAlbumForm({ ...albumForm, cover_url: url })}
                    folder="albums"
                    placeholder="Upload album cover"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={albumForm.sort_order}
                    onChange={(e) => setAlbumForm({ ...albumForm, sort_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                  >
                    {editingAlbum ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Media Modal */}
        {isMediaModalOpen && selectedAlbum && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Add Media to {selectedAlbum.title}</h2>
              <form onSubmit={handleMediaSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Media Type</label>
                  <select
                    value={mediaForm.media_type}
                    onChange={(e) => setMediaForm({ ...mediaForm, media_type: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {mediaForm.media_type === "image" ? "Upload Image" : "Video URL"}
                  </label>
                  {mediaForm.media_type === "image" ? (
                    <ImageUpload
                      value={mediaForm.media_url}
                      onChange={(url) => setMediaForm({ ...mediaForm, media_url: url })}
                      folder="albums"
                      placeholder="Upload image"
                    />
                  ) : (
                    <input
                      value={mediaForm.media_url}
                      onChange={(e) => setMediaForm({ ...mediaForm, media_url: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Caption</label>
                  <input
                    value={mediaForm.caption}
                    onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={mediaForm.sort_order}
                    onChange={(e) => setMediaForm({ ...mediaForm, sort_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                  >
                    Add Media
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAlbums;
