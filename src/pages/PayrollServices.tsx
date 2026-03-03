import React, { useState } from 'react';
import {
    DollarSign, Clock, Shield, FileText, BarChart2, CheckCircle, Users,
    Globe, Zap, ChevronDown, ChevronUp, ArrowRight, Star
} from 'lucide-react';
import CTASection from '../components/home/CTASection';

/* ─────────── DATA ─────────── */
const whatWeHandle = [
    {
        icon: DollarSign,
        title: 'Payroll Processing',
        desc: 'Calculating employee salaries to ensuring timely disbursement, our payroll engine manages payroll processing end-to-end with accuracy and speed.',
    },
    {
        icon: Shield,
        title: 'Statutory Compliance Management',
        desc: 'Right from PF, ESI, LWF and PT deductions to seamless remittances, we ensure complete statutory compliance, minimising risks and penalties.',
    },
    {
        icon: FileText,
        title: 'Taxation & Deductions (IT and TDS)',
        desc: 'Our payroll automates IT and TDS deductions, ensuring precise calculations and hassle-free tax compliance for employees and employers.',
    },
    {
        icon: Clock,
        title: 'Leave & Attendance Integration',
        desc: 'Integrated with leave and attendance, our payroll ensures accurate salary computation, preventing errors and saving valuable HR time.',
    },
    {
        icon: Users,
        title: 'Employee Self-Service (ESS) Portals',
        desc: 'With ESS portals, employees can access payslips, tax forms, and leave balances anytime, empowering them with complete payroll transparency.',
    },
    {
        icon: Globe,
        title: 'Multi-Location Payroll',
        desc: 'Handle payroll across multiple locations effortlessly with centralised control, ensuring consistent policies and compliance everywhere.',
    },
    {
        icon: BarChart2,
        title: 'Full & Final Settlement',
        desc: 'From pending salaries to recoveries, our payroll simplifies full and final settlement, ensuring smooth employee exit management.',
    },
    {
        icon: CheckCircle,
        title: 'Leave Encashment & Gratuity',
        desc: 'Automated leave encashment and gratuity settlement processes ensure compliance, transparency, and faster employee benefit disbursement.',
    },
    {
        icon: Zap,
        title: 'Allowances & Deductions',
        desc: 'Easily manage variable allowances and deductions with our payroll, ensuring accurate salary structuring and better cost control.',
    },
];

const processPoints = [
    'SLA-driven processes with clearly defined and verifiable deliverables.',
    'Fully automated payroll outsourcing eliminates possibilities of human errors.',
    'Processes adhere to all standards of corporate governance and tax regulations.',
    'Multi-level process checks completely mitigate errors before disbursement.',
    'Pre-payroll validations and post-payroll QA ensure 100% accuracy — error-free.',
    'Our client retention rate of 98.9% makes us the best payroll outsourcing partner in India.',
];

const whyOutsource = [
    {
        title: 'Smart Payroll Operations',
        subtitle: 'Accurate. Automated. Always on time.',
        color: 'from-blue-500 to-indigo-600',
        points: [
            'Salary disbursal with multi-level quality checks',
            'Full & Final (F&F) settlement management',
            'Monthly payslips, tax slips & reimbursement slips',
            'Flexi benefit plan configuration',
            'Travel & expense claims (local & outstation)',
        ],
    },
    {
        title: 'Employee Experience & Self-Service',
        subtitle: 'Empower employees. Reduce HR dependency.',
        color: 'from-purple-500 to-pink-600',
        points: [
            'Online attendance management',
            'Reimbursement entry & approval workflows',
            'Investment proof upload & verification',
            'Centralised query management system',
            'Employees get transparency. HR gets peace of mind.',
        ],
    },
    {
        title: 'Compliance & Statutory Excellence',
        subtitle: 'Stay compliant. Stay audit-ready.',
        color: 'from-emerald-500 to-teal-600',
        points: [
            'Payroll compliance support (PF, ESI, PT, LWF)',
            'Form 16 / 12BA with digital signature',
            'Income tax return processing',
            'Reports, MIS & journal vouchers',
            'Compliance is not an option. We make it effortless.',
        ],
    },
    {
        title: 'Governance, Control & Assurance',
        subtitle: 'Processes you can rely on. Systems you can trust.',
        color: 'from-orange-500 to-red-600',
        points: [
            'SLA-driven processes & deliverables',
            'Multi-level review & validation checks',
            'Post-process helpdesk & payroll reviews',
            'Defined backup & business continuity plans',
            'Disaster recovery readiness',
        ],
    },
];

const stats = [
    { value: '10,000+', label: 'Employees Processed' },
    { value: '99.9%', label: 'Accuracy Rate' },
    { value: '98.9%', label: 'Client Retention' },
    { value: '100%', label: 'Compliance Rate' },
];

/* ─────────── FAQ ─────────── */
const faqs = [
    { q: 'How quickly can IQS onboard our payroll?', a: 'We typically complete onboarding within 2–4 weeks depending on the complexity and size of your workforce. Our team provides a dedicated implementation manager throughout.' },
    { q: 'Is our employee data secure with IQS?', a: 'Absolutely. We follow ISO-aligned data security protocols with encrypted storage, role-based access, and strict confidentiality agreements for all client data.' },
    { q: 'Do you handle multi-state statutory compliance?', a: 'Yes. We manage PF, ESI, PT, LWF and other statutory requirements across all Indian states with a centralised compliance dashboard.' },
    { q: 'Can you integrate with our existing HRMS?', a: 'Yes, we support integration with leading HRMS platforms including SAP, Darwinbox, Keka, GreytHR, and more via API or file-based data exchange.' },
];

/* ─────────── COMPONENT ─────────── */
const PayrollServices: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    React.useEffect(() => {
        document.title = 'Payroll Services | IQS - Integrated Quality Solutions';
    }, []);

    return (
        <>
            {/* ── Hero ── */}
            <section
                className="relative pt-20 overflow-hidden"
                style={{
                    backgroundImage: 'url(https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-primary-700/85 z-0" />
                <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-28">
                    <div className="max-w-4xl animate-fade-in">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
                            <Zap className="w-4 h-4" />
                            End-to-End Payroll Outsourcing
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-white mb-6 leading-tight">
                            Payroll Services
                        </h1>
                        <p className="text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
                            End-to-End Payroll. Zero Headaches. Total Compliance.<br />
                            <span className="text-white/60 text-lg">A secure, scalable, and fully managed payroll experience — so your team can focus on growth, not transactions.</span>
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8">
                            {stats.map((s, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl font-bold text-white">{s.value}</div>
                                    <div className="text-sm text-white/60 mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* ── What We Handle ── */}
            <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-14">
                        <span className="inline-block bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                            Comprehensive Coverage
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-white mb-4">
                            What We Handle for You
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                            Choosing IQS as your outsource payroll services provider can be advantageous due to our specialised expertise and comprehensive range of services.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {whatWeHandle.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={i}
                                    className="group bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/40 group-hover:bg-primary-100 dark:group-hover:bg-primary-800/40 flex items-center justify-center mb-4 transition-colors">
                                        <Icon className="w-6 h-6 text-primary-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Our Process ── */}
            <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                                What We Do
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-white mb-4">
                                Our Payroll Processing System
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                The payroll services we deliver follows clearly defined SLAs and processes. Our commitment to delivery can be easily understood and verified.
                            </p>
                            <div className="space-y-4">
                                {processPoints.map((point, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.pexels.com/photos/6693661/pexels-photo-6693661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                alt="Payroll Processing Team"
                                className="rounded-2xl shadow-elevation-3 w-full"
                            />
                            {/* Floating stat badge */}
                            <div className="absolute -bottom-5 -left-5 bg-white dark:bg-gray-900 rounded-2xl shadow-elevation-2 px-5 py-4 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                                        <Star className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-gray-900 dark:text-white">98.9%</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Client Retention Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Why Outsource ── */}
            <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-14">
                        <span className="inline-block bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                            Why Choose IQS
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-white mb-4">
                            Why Outsource Your Payroll to IQS?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                            End-to-End Payroll. Zero Headaches. Total Compliance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {whyOutsource.map((pillar, i) => (
                            <div
                                key={i}
                                className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
                            >
                                <div className={`h-1.5 bg-gradient-to-r ${pillar.color}`} />
                                <div className="p-6 md:p-8">
                                    <h3 className="text-xl font-bold font-montserrat text-gray-900 dark:text-white mb-1">{pillar.title}</h3>
                                    <p className="text-sm text-primary-600 dark:text-blue-400 font-semibold mb-5 italic">{pillar.subtitle}</p>
                                    <ul className="space-y-2.5">
                                        {pillar.points.map((pt, j) => (
                                            <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                                                <ArrowRight className="w-4 h-4 text-primary-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                                {pt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* One Partner Banner */}
                    <div className="mt-10 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-8 md:p-10 text-center text-white">
                        <h3 className="text-2xl md:text-3xl font-bold font-montserrat mb-3">One Partner. Complete Accountability.</h3>
                        <p className="text-white/80 max-w-2xl mx-auto text-lg">
                            From attendance to tax filing, from employee queries to audits — IQS owns the entire payroll lifecycle, end to end.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-white mb-3">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">Everything you need to know about our payroll services.</p>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden"
                            >
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
                                    <div className="px-6 pb-5 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
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

export default PayrollServices;
