import React, { useState } from 'react';
import {
    Globe, Smartphone, Wrench, Cloud, ShieldCheck, LayoutDashboard,
    Code2, Database, Zap, CheckCircle, ArrowRight, ChevronDown, ChevronUp,
    Monitor, RefreshCw, Headphones, BarChart2, Star, Users
} from 'lucide-react';
import CTASection from '../components/home/CTASection';
import { Link } from 'react-router-dom';

/* ─────────── DATA ─────────── */

const services = [
    {
        icon: Globe,
        title: 'Web Application Development',
        color: 'from-blue-500 to-indigo-600',
        desc: 'Custom, scalable web applications built with modern stacks — React, Next.js, Node.js, and more. From simple landing pages to complex enterprise portals.',
        points: [
            'Full-stack web app development (MERN / MEAN / LAMP)',
            'SaaS product development & multi-tenant architecture',
            'Admin dashboards & internal tools',
            'API development & third-party integrations',
            'Progressive Web Apps (PWA)',
            'Performance-optimized, SEO-ready codebase',
        ],
    },
    {
        icon: Smartphone,
        title: 'Mobile App Development',
        color: 'from-purple-500 to-pink-600',
        desc: 'Native and cross-platform mobile apps for iOS & Android — built for speed, usability, and scale. We bring your idea to the App Store.',
        points: [
            'React Native & Flutter cross-platform apps',
            'iOS (Swift) & Android (Kotlin) native apps',
            'UI/UX design tailored for mobile',
            'Push notifications & offline support',
            'App Store & Play Store deployment',
            'Real-time features (chat, live tracking, etc.)',
        ],
    },
    {
        icon: LayoutDashboard,
        title: 'UI/UX Design & Prototyping',
        color: 'from-emerald-500 to-teal-600',
        desc: 'User-centered design that converts. We craft beautiful, intuitive interfaces backed by research and tested with real users.',
        points: [
            'Wireframes, mockups & interactive prototypes',
            'Design system & component libraries',
            'Responsive design for all devices',
            'User research & usability testing',
            'Figma / Adobe XD design handoff',
            'Accessibility (WCAG 2.1) compliance',
        ],
    },
    {
        icon: Cloud,
        title: 'Cloud & DevOps Solutions',
        color: 'from-orange-500 to-red-600',
        desc: 'Reliable cloud infrastructure, CI/CD pipelines, and DevOps practices to keep your application running 24/7 with zero downtime.',
        points: [
            'AWS, GCP & Azure cloud setup & migration',
            'Docker & Kubernetes containerization',
            'CI/CD pipeline setup (GitHub Actions, GitLab CI)',
            'Auto-scaling & load balancing',
            'Infrastructure as Code (Terraform)',
            'Cloud cost optimization',
        ],
    },
    {
        icon: Database,
        title: 'Database Design & Management',
        color: 'from-cyan-500 to-blue-600',
        desc: 'Robust database architecture for high-volume applications. We design, optimize, and manage your data layer for maximum performance and reliability.',
        points: [
            'Relational DBs: PostgreSQL, MySQL, SQL Server',
            'NoSQL: MongoDB, Firebase, DynamoDB',
            'Database schema design & normalization',
            'Query optimization & indexing',
            'Data migration & ETL pipelines',
            'Backup, recovery & replication strategies',
        ],
    },
    {
        icon: Wrench,
        title: 'Application Maintenance & Support',
        color: 'from-slate-500 to-gray-600',
        desc: 'Ongoing support to keep your application healthy, up-to-date, and evolving with your business needs. We become your extended tech team.',
        points: [
            'Bug fixes & performance improvements',
            'Security patches & dependency updates',
            'Feature additions & iterative enhancements',
            '24/7 monitoring & incident response',
            'Code refactoring & technical debt reduction',
            'SLA-backed support plans',
        ],
    },
];

const process = [
    { step: '01', title: 'Discovery & Planning', desc: 'We understand your business goals, define scope, and create a detailed project roadmap and technical blueprint.' },
    { step: '02', title: 'UI/UX Design', desc: 'High-fidelity prototypes are crafted and approved before a single line of code is written — saving time and rework.' },
    { step: '03', title: 'Agile Development', desc: 'Development in 2-week sprints with weekly demos. You track progress in real time and provide feedback continuously.' },
    { step: '04', title: 'QA & Testing', desc: 'Manual, automated, and performance testing across browsers and devices ensures a rock-solid, bug-free release.' },
    { step: '05', title: 'Deployment & Launch', desc: 'CI/CD-powered deployment to production with zero-downtime release strategies and post-launch monitoring.' },
    { step: '06', title: 'Support & Growth', desc: 'Ongoing maintenance, feature iterations, and technical support to keep your product evolving continuously.' },
];

const techStack = [
    { cat: 'Frontend', items: ['React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript'] },
    { cat: 'Backend', items: ['Node.js', 'Python', 'Java Spring', '.NET', 'PHP Laravel'] },
    { cat: 'Mobile', items: ['React Native', 'Flutter', 'Swift', 'Kotlin'] },
    { cat: 'Database', items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Firebase', 'Redis'] },
    { cat: 'Cloud', items: ['AWS', 'Google Cloud', 'Azure', 'Vercel', 'Docker'] },
    { cat: 'Tools', items: ['Git', 'Jira', 'Figma', 'Postman', 'GitHub Actions'] },
];

const stats = [
    { value: '50+', label: 'Projects Delivered' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '5+', label: 'Years Experience' },
    { value: '15+', label: 'Tech Experts' },
];

const faqs = [
    { q: 'What types of projects do you outsource?', a: 'We handle web apps, mobile apps, enterprise portals, SaaS platforms, APIs, and digital transformation projects — from MVPs to full-scale enterprise products.' },
    { q: 'How do you ensure code quality?', a: 'We use peer code reviews, automated testing (unit, integration, E2E), linting standards, and CI/CD pipelines. Every release goes through QA before deployment.' },
    { q: 'Can I see progress during development?', a: 'Absolutely. We work in Agile sprints with weekly demos and a live staging environment. You have full visibility into work-in-progress at all times.' },
    { q: 'Do you sign NDAs and IP agreements?', a: 'Yes. All intellectual property created during the project belongs to you. We sign NDAs and IP assignment agreements before work begins.' },
    { q: 'What is the typical project timeline?', a: 'MVPs typically take 6–12 weeks. Full-featured platforms take 3–6 months. We provide a detailed timeline after the discovery phase.' },
];

/* ─────────── COMPONENT ─────────── */
const ProjectOutsourcing: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    React.useEffect(() => {
        document.title = 'Project Outsourcing | IQS - Integrated Quality Solutions';
    }, []);

    return (
        <>
            {/* ── Hero ── */}
            <section className="relative pt-20 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url(https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)' }}
                >
                    <div className="absolute inset-0 bg-primary-700 opacity-90" />
                </div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-28">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
                            <Code2 className="w-4 h-4" />
                            End-to-End Technology Outsourcing
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-white mb-6 leading-tight">
                            Project Outsourcing<br />
                            <span className="text-yellow-400">Done Right.</span>
                        </h1>
                        <p className="text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
                            Web & mobile development, cloud infrastructure, and ongoing support — all under one roof. Build faster. Ship smarter. Scale confidently.
                        </p>
                        {/* Stats */}
                        <div className="flex flex-wrap gap-10 mb-10">
                            {stats.map((s, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl font-bold text-white">{s.value}</div>
                                    <div className="text-sm text-white/60 mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                Start a Project <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a
                                href="#services"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                            >
                                Explore Services
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Services Grid ── */}
            <section id="services" className="py-16 md:py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-14">
                        <span className="inline-block bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                            What We Build
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-white mb-4">
                            Full-Spectrum Development Services
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                            From ideation to launch and beyond — we cover every layer of your technology stack.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((svc, i) => {
                            const Icon = svc.icon;
                            return (
                                <div
                                    key={i}
                                    className="group bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-750 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl"
                                >
                                    <div className={`h-1.5 bg-gradient-to-r ${svc.color}`} />
                                    <div className="p-6">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center mb-4 shadow-sm`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold font-montserrat text-gray-900 dark:text-white mb-2">{svc.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{svc.desc}</p>
                                        <ul className="space-y-2">
                                            {svc.points.map((pt, j) => (
                                                <li key={j} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                    <CheckCircle className="w-3.5 h-3.5 text-primary-500 flex-shrink-0 mt-0.5" />
                                                    {pt}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Why Choose IQS for Outsourcing ── */}
            <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                        <div>
                            <span className="inline-block bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                                Why IQS?
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-white mb-6">
                                Your Trusted Outsourcing Partner
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                We don't just write code — we become an extension of your team, aligned with your goals, timelines, and quality standards.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { icon: ShieldCheck, title: 'IP Protection', desc: 'NDA & IP agreements before day one.' },
                                    { icon: BarChart2, title: 'Transparent Progress', desc: 'Weekly sprint demos & live staging access.' },
                                    { icon: RefreshCw, title: 'Agile Delivery', desc: '2-week cycles with continuous feedback.' },
                                    { icon: Headphones, title: 'Dedicated Support', desc: 'Named project manager & direct dev access.' },
                                    { icon: Monitor, title: 'Modern Tech Stack', desc: 'Always using the latest, proven technologies.' },
                                    { icon: Users, title: 'Expert Team', desc: '15+ senior engineers across web & mobile.' },
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={i} className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-5 h-5 text-primary-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm text-gray-900 dark:text-white">{item.title}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                alt="Development Team Collaboration"
                                className="rounded-2xl shadow-2xl w-full"
                            />
                            {/* Floating badge */}
                            <div className="absolute -bottom-5 -left-5 bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-5 py-4 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                                        <Star className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-gray-900 dark:text-white">98%</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Client Satisfaction</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Our Process ── */}
            <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-14">
                        <span className="inline-block bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                            How We Work
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-white mb-4">
                            Our Delivery Process
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                            A structured, transparent, and collaborative process from day one to launch — and beyond.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {process.map((p, i) => (
                            <div key={i} className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                                <div className="text-5xl font-black text-primary-100 dark:text-primary-900 leading-none mb-3">{p.step}</div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{p.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{p.desc}</p>
                                {i < process.length - 1 && (
                                    <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-primary-300 dark:text-primary-700 z-10" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Tech Stack ── */}
            <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                            Technologies
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-white mb-3">
                            Our Technology Stack
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                            We use battle-tested technologies and always keep up with the industry's best tools.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {techStack.map((cat, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap className="w-4 h-4 text-primary-600 dark:text-blue-400" />
                                    <span className="text-xs font-bold text-primary-600 dark:text-blue-400 uppercase tracking-wider">{cat.cat}</span>
                                </div>
                                <ul className="space-y-1.5">
                                    {cat.items.map((item, j) => (
                                        <li key={j} className="text-xs text-gray-600 dark:text-gray-300">• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-white mb-3">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">Common questions about outsourcing your project to IQS.</p>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                                >
                                    <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.q}</span>
                                    {openFaq === i
                                        ? <ChevronUp className="w-5 h-5 text-primary-600 dark:text-blue-400 flex-shrink-0" />
                                        : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    }
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-5 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
};

export default ProjectOutsourcing;
