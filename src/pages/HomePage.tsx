import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Zap, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <motion.div
    className="bg-card p-6 rounded-lg border border-border shadow-sm"
    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 font-display">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);
export function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <ThemeToggle className="fixed top-4 right-4" />
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className="text-2xl font-bold font-display">Zenvoice</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Sign Up Free
            </Button>
          </Link>
        </nav>
      </header>
      <main>
        {/* Hero Section */}
        <section className="py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold font-display text-balance">
                Effortless Invoicing for Modern Businesses
              </h2>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Create beautiful invoices, manage clients, and get paid faster. Zenvoice simplifies your finances so you can focus on what you do best.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white group">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/50 dark:bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold font-display">Why Zenvoice?</h3>
              <p className="mt-4 text-lg text-muted-foreground">Everything you need, nothing you don't.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-indigo-600" />}
                title="Blazing Fast"
                description="Create and send professional invoices in seconds with our intuitive interface."
              />
              <FeatureCard
                icon={<FileText className="w-6 h-6 text-indigo-600" />}
                title="Beautiful Templates"
                description="Impress your clients with stunning, customizable invoice and estimate templates."
              />
              <FeatureCard
                icon={<Users className="w-6 h-6 text-indigo-600" />}
                title="Client Management"
                description="Keep track of all your clients and their payment history in one organized place."
              />
              <FeatureCard
                icon={<CheckCircle className="w-6 h-6 text-indigo-600" />}
                title="Get Paid Faster"
                description="Easily track invoice statuses and send automated reminders for overdue payments."
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Zenvoice. All rights reserved.</p>
          <p className="text-sm text-muted-foreground/80 mt-2">Built with ���️ at Cloudflare</p>
        </div>
      </footer>
    </div>
  );
}