import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { useBooks, useDeleteBook } from "@/hooks/useCms";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

const AdminBooks = () => {
  const navigate = useNavigate();
  const { data: books, isLoading } = useBooks();
  const remove = useDeleteBook();

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Books</h1>
          <p className="text-muted-foreground font-body mt-1">Manage your published works</p>
        </div>
        <button 
          onClick={() => navigate("/admin/books/new")} 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-sm hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> Add Book
        </button>
      </div>

      {isLoading ? <p className="text-muted-foreground font-body">Loading...</p> : (
        <div className="space-y-4">
          {books?.length === 0 && <p className="text-muted-foreground font-body">No books yet. Click "Add Book" to create one.</p>}
          {books?.map((book: any) => (
            <div key={book.id} className="bg-card border border-border rounded-sm p-4 flex items-center gap-4">
              {book.cover_url && <img src={book.cover_url} alt={book.title} className="w-16 h-20 object-cover rounded-sm" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-foreground truncate">{book.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{book.year}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/admin/books/${book.id}`)} 
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={async () => { 
                    if (confirm("Delete this book?")) {
                      await remove.mutateAsync(book.id); 
                      toast.success("Deleted"); 
                    }
                  }} 
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBooks;
