import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useSiteContent, usePageSections } from "@/hooks/useCms";
import SectionRenderer from "@/components/SectionRenderer";
import authorPortrait from "@/assets/author-portrait.jpg";
import PageHeader from "@/components/PageHeader";
import { BookOpen, Users, Award, Heart, GraduationCap, Briefcase, ArrowRight } from "lucide-react";

const AboutPage = () => {
  // All hooks must be called unconditionally at the top
  const { data: pageSections = [] } = usePageSections("about");
  const ref = useRef(null);
  const skillsRef = useRef(null);
  const eduRef = useRef(null);
  const expRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const skillsInView = useInView(skillsRef, { once: true, margin: "-100px" });
  const eduInView = useInView(eduRef, { once: true, margin: "-100px" });
  const expInView = useInView(expRef, { once: true, margin: "-100px" });
  const { data: content } = useSiteContent();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", subject: "", message: "" });

  // If sections exist in backend, render them instead of hardcoded content
  if (pageSections.length > 0) {
    return (
      <main className="pt-20">
        <SectionRenderer sections={pageSections} />
      </main>
    );
  }

  const portrait = content?.about_portrait || authorPortrait;

  const iconMap: Record<string, any> = { BookOpen, Users, Award, Heart, GraduationCap, Briefcase };

  const services = content?.about_services ? JSON.parse(content.about_services) : [
    { icon: "BookOpen", title: "Published Author", desc: "3 Books" },
    { icon: "Users", title: "Marriage Counsellor", desc: "100+ Couples" },
    { icon: "Award", title: "Healthcare Marketing", desc: "27+ Years" },
    { icon: "Heart", title: "Theologian", desc: "Ministry Leader" },
  ];

  const skills = content?.about_skills ? JSON.parse(content.about_skills) : [
    { name: "Healthcare Marketing", level: 95 },
    { name: "Theology", level: 90 },
    { name: "Marriage Counselling", level: 88 },
    { name: "Leadership", level: 92 },
    { name: "Public Speaking", level: 85 },
    { name: "Writing & Publishing", level: 90 },
  ];

  const education = content?.about_education ? JSON.parse(content.about_education) : [
    { degree: "Healthcare Management", institution: "Harvard Business School", year: "Certificate", desc: "Executive education program focused on healthcare leadership and strategic management." },
    { degree: "Marketing Management", institution: "GIMPA", year: "Diploma", desc: "Ghana Institute of Management and Public Administration - Professional marketing certification." },
    { degree: "Business Administration", institution: "University of Ghana", year: "Degree", desc: "University of Ghana Business School - Foundation in business principles and management." },
    { degree: "Theology Studies", institution: "Dominion University College", year: "Certificate", desc: "Advanced theological studies focusing on pastoral care and biblical counselling." },
  ];

  const experiences = content?.about_experiences ? JSON.parse(content.about_experiences) : [
    { role: "Healthcare Marketing Specialist", company: "ACIMG Member", period: "1997 - Present", desc: "Associate Member of the Chartered Institute of Marketing, Ghana. Leading healthcare marketing initiatives and institutional development." },
    { role: "Author & Speaker", company: "Independent", period: "2020 - Present", desc: "Published author of 3 books on healthcare, faith, and marriage. Regular speaker at conferences and workshops." },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <main className="pt-20">
      <PageHeader
        title="About Me"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "About Me" }
        ]}
      />

      {/* Services/Expertise Icons Row */}
      <section className="py-12 bg-background" ref={ref}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service: any, i: number) => {
              const IconComponent = iconMap[service.icon] || BookOpen;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="bg-secondary rounded-xl p-6 text-center border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 mx-auto mb-3 text-primary">
                    <IconComponent size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-sm mb-1">{service.title}</h3>
                  <p className="text-xs text-muted-foreground font-body">{service.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-background" ref={skillsRef}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={skillsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-6">Professional Skills</h3>
              <div className="space-y-4">
                {skills.slice(0, 3).map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-body text-sm text-foreground">{skill.name}</span>
                      <span className="font-body text-sm text-primary">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={skillsInView ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - More Skills */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={skillsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-6">Ministry & Writing</h3>
              <div className="space-y-4">
                {skills.slice(3).map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-body text-sm text-foreground">{skill.name}</span>
                      <span className="font-body text-sm text-primary">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={skillsInView ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid lg:grid-cols-2 gap-4 mt-12">
            {/* Left - Years of Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={skillsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-secondary rounded-xl p-8"
            >
              <div className="flex items-center gap-6 mb-4">
                <span className="font-display text-6xl md:text-7xl font-bold text-primary">{content?.years_experience || "27"}</span>
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">Years Of</h3>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">Experience</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-body">
                {content?.experience_description || "Healthcare marketing specialist, theologian, and author providing expert guidance to help people and institutions grow with purpose."}
              </p>
            </motion.div>

            {/* Right - Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-secondary rounded-xl p-6 text-center"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">{content?.stat_books || "3"}</p>
                <p className="text-xs text-muted-foreground font-body">{content?.stat_books_label || "Published Books"}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="bg-secondary rounded-xl p-6 text-center"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">{content?.stat_certification || "Harvard"}</p>
                <p className="text-xs text-muted-foreground font-body">{content?.stat_certification_label || "Certified"}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-secondary rounded-xl p-6 text-center border-l-4 border-primary"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">{content?.stat_workshops || "200+"}</p>
                <p className="text-xs text-muted-foreground font-body">{content?.stat_workshops_label || "Workshops"}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="bg-secondary rounded-xl p-6 text-center border-l-4 border-primary"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">{content?.stat_lives || "1,000+"}</p>
                <p className="text-xs text-muted-foreground font-body">{content?.stat_lives_label || "Lives Transformed"}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-16 bg-secondary" ref={eduRef}>
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={eduInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-10"
          >
            Education
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu, i) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, y: 20 }}
                animate={eduInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-background rounded-xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-body font-semibold mb-1">{edu.year}</p>
                    <h4 className="font-display font-bold text-foreground mb-1">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground font-body mb-2">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground font-body leading-relaxed">{edu.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-background" ref={expRef}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={expInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <img
                src={portrait}
                alt="Gidel Fiavor"
                className="w-full max-w-md mx-auto aspect-[4/5] object-cover shadow-lg transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl filter hover:brightness-105"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={expInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">Experience</h2>
              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <div key={exp.role} className="border-l-2 border-primary pl-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full" />
                    <div className="flex items-start gap-3 mb-2">
                      <Briefcase size={16} className="text-primary mt-1" />
                      <div>
                        <p className="text-xs text-primary font-body font-semibold">{exp.period}</p>
                        <h4 className="font-display font-bold text-foreground">{exp.role}</h4>
                        <p className="text-sm text-muted-foreground font-body">{exp.company}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed ml-7">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-background rounded-2xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Appointment Now <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
