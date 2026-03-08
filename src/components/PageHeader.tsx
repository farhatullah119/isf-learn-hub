import afghanistanFlag from "@/assets/afghanistan-flag.png";

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${afghanistanFlag})` }}
      />
      <div className="absolute inset-0 bg-foreground/60" />
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-lg text-white/90 max-w-2xl">{description}</p>
      </div>
    </section>
  );
};

export default PageHeader;
