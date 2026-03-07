import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; to?: string }[];
  backgroundImage?: string;
}

const PageHeader = ({ title, subtitle, breadcrumbs, backgroundImage }: PageHeaderProps) => {
  const hasBackground = !!backgroundImage;
  
  return (
    <section 
      className={`relative py-20 ${hasBackground ? 'min-h-[40vh] flex items-center' : 'bg-secondary'}`}
      style={hasBackground ? { 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      {hasBackground && <div className="absolute inset-0 bg-black/60" />}
      <div className={`container mx-auto px-6 text-center ${hasBackground ? 'relative z-10' : ''}`}>
        <h1 className={`font-display text-3xl md:text-5xl font-bold mb-4 ${hasBackground ? 'text-white' : 'text-foreground'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`text-lg font-body max-w-2xl mx-auto mb-4 ${hasBackground ? 'text-white/90' : 'text-muted-foreground'}`}>
            {subtitle}
          </p>
        )}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center justify-center gap-1 text-sm font-body">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight size={14} className={hasBackground ? 'text-white/60' : 'text-muted-foreground'} />}
                {crumb.to ? (
                  <Link to={crumb.to} className={`${hasBackground ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-foreground'} transition-colors`}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={hasBackground ? 'text-white' : 'text-primary'}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
