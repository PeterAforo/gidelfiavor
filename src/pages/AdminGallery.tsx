import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useGalleryImages, useUpsertGalleryImage, useDeleteGalleryImage, uploadFile } from "@/hooks/useCms";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

const AdminGallery = () => {
  const { data: images, isLoading } = useGalleryImages();
  const upsert = useUpsertGalleryImage();
  const remove = useDeleteGalleryImage();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await uploadFile(files[i], "gallery");
        await upsert.mutateAsync({
          image_url: url,
          caption: files[i].name.replace(/\.[^.]+$/, ""),
          sort_order: (images?.length || 0) + i,
        });
      } catch (e: any) {
        toast.error(e.message);
      }
    }
    setUploading(false);
    toast.success("Images uploaded!");
  };

  const handleCaptionUpdate = async (id: string, caption: string) => {
    await upsert.mutateAsync({ id, caption });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Gallery</h1>
          <p className="text-muted-foreground font-body mt-1">Manage your photo gallery</p>
        </div>
        <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-sm hover:bg-primary/90 transition-colors cursor-pointer">
          <Plus size={16} /> Upload Images
          <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && handleUpload(e.target.files)} className="hidden" />
        </label>
      </div>

      {uploading && <p className="text-muted-foreground font-body mb-4">Uploading...</p>}

      {isLoading ? <p className="text-muted-foreground font-body">Loading...</p> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images?.length === 0 && <p className="text-muted-foreground font-body col-span-full">No images yet.</p>}
          {images?.map((img) => (
            <div key={img.id} className="bg-card border border-border rounded-sm overflow-hidden group relative">
              <img src={img.image_url} alt={img.caption} className="w-full h-48 object-cover" />
              <div className="p-3">
                <input
                  defaultValue={img.caption}
                  onBlur={(e) => handleCaptionUpdate(img.id, e.target.value)}
                  className="w-full text-sm font-body text-foreground bg-transparent border-b border-transparent focus:border-border focus:outline-none"
                  placeholder="Caption..."
                />
              </div>
              <button
                onClick={async () => { await remove.mutateAsync(img.id); toast.success("Deleted"); }}
                className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminGallery;
