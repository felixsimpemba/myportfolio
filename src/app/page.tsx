import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
  User, 
  Briefcase, 
  Code, 
  Palette, 
  Eye, 
  ArrowRight,
  Star,
  Sparkles,
  Zap,
  Rocket,
  Users,
  Share2,
  Twitter,
  Github,
  Linkedin
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Home() {
  const features = [
    {
      icon: User,
      title: "Smart Profile Builder",
      description: "AI-powered profile creation that adapts to your industry and experience level",
    },
    {
      icon: Briefcase,
      title: "Dynamic Experience Showcase",
      description: "Interactive timeline that brings your career journey to life",
    },
    {
      icon: Code,
      title: "Project Gallery",
      description: "Stunning visual showcase of your work with live demos and code snippets",
    },
    {
      icon: Palette,
      title: "Unlimited Customization",
      description: "Complete design control with modern themes and custom branding",
    },
    {
      icon: Eye,
      title: "Real-time Preview",
      description: "Instant visual feedback as you build with live collaboration features",
    },
    {
      icon: Share2,
      title: "One-Click Sharing",
      description: "Share your portfolio instantly with beautiful, shareable links",
    }
  ];

  const testimonials = [
    {
      name: "Sarah K.",
      role: "UX Designer",
      quote: "MyPortfolio helped me land my dream job. The templates are stunning and so easy to customize. I had a beautiful portfolio in less than an hour!",
      avatar: null
    },
    {
      name: "David L.",
      role: "Frontend Developer",
      quote: "As a developer, I appreciate how easy it is to showcase my projects with code snippets and live demos. A must-have tool for any tech professional.",
      avatar: null
    },
    {
      name: "Maria G.",
      role: "Data Scientist",
      quote: "I'm not a designer, but with MyPortfolio, I created a professional-looking site that perfectly highlights my skills and research. Highly recommended!",
      avatar: null
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-slate-900">
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center animate-pulse-glow shadow-lg shadow-emerald-500/25">
              <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">MyPortfolio</span>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeSwitcher />
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex border-2 border-slate-200 dark:border-slate-700 glass-effect hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:scale-105 transition-all duration-300">
                <span className="hidden sm:inline">Sign Up</span>
                <span className="sm:hidden">Sign Up</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 pt-20 sm:pt-0 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-transparent to-teal-100/30 dark:from-emerald-900/20 dark:to-teal-900/20 animate-gradient-xy"></div>
      
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-teal-400/20 to-amber-400/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-tr from-emerald-300/10 to-teal-300/10 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 sm:mb-8 animate-pulse">
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Craft Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 bg-clip-text text-transparent">
              Narrative
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Build a portfolio that tells your unique story. Our intuitive platform empowers you to create a 
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold"> stunning, professional online presence</span> that stands out.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16 sm:mb-20">
            <Link href="/auth/signup">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-2xl hover:shadow-3xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:scale-105 transition-all duration-300 animate-pulse-glow">
                <Rocket className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                Start Your Journey
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-5 border-2 border-slate-200 dark:border-slate-700 glass-effect transform hover:scale-105 transition-all duration-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-600">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 md:py-32 px-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-background to-slate-50/50 dark:from-slate-800/20 dark:via-background dark:to-slate-800/20"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-effect text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4 sm:mb-6 border border-emerald-200 dark:border-emerald-800">
              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                A Symphony of
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed px-4">
              Everything you need to compose a masterpiece that is 
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold"> uniquely you</span>.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative p-4 sm:p-6 md:p-8 border border-slate-200/50 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-500 transform hover:-translate-y-2 sm:hover:-translate-y-3 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/50 dark:from-emerald-900/20 dark:via-transparent dark:to-teal-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-emerald-500/25">
                    <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-emerald-600 dark:text-emerald-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Decorative element */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-300/60 rounded-full group-hover:bg-emerald-400 transition-colors duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 md:py-32 px-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-50/30 to-background dark:via-slate-800/20"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-effect text-xs sm:text-sm font-medium text-teal-600 dark:text-teal-400 mb-4 sm:mb-6 border border-teal-200 dark:border-teal-800">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>User Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Loved by
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
                Creatives & Developers
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed px-4">
              Don&apos;t just take our word for it. Here&apos;s what our 
              <span className="text-teal-600 dark:text-teal-400 font-semibold"> amazing users</span> are saying.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="group relative p-4 sm:p-6 md:p-8 border border-slate-200/50 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 flex flex-col items-start overflow-hidden"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-transparent to-emerald-50/50 dark:from-teal-900/20 dark:via-transparent dark:to-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Quote decoration */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-3xl sm:text-4xl md:text-6xl text-teal-200/40 dark:text-teal-800/40 font-serif leading-none group-hover:text-teal-300/60 dark:group-hover:text-teal-700/60 transition-colors duration-300">
                  &ldquo;
                </div>
                
                <div className="relative z-10 w-full">
                  <div className="flex items-center mb-4 sm:mb-6">
                    {/* Enhanced avatar */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/50 dark:to-emerald-900/50 flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-teal-500/25">
                      <User className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-teal-600 dark:text-teal-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base sm:text-lg md:text-xl text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">{testimonial.name}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 italic text-sm sm:text-base md:text-lg leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300 relative">
                    <span className="text-teal-400/60 dark:text-teal-600/60 text-lg sm:text-xl md:text-2xl font-serif absolute -left-1 -top-1 sm:-left-2 sm:-top-2">&ldquo;</span>
                    {testimonial.quote}
                    <span className="text-teal-400/60 dark:text-teal-600/60 text-lg sm:text-xl md:text-2xl font-serif">&rdquo;</span>
                  </p>
                  
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 mt-4 sm:mt-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 fill-current group-hover:scale-110 transition-transform duration-300" style={{animationDelay: `${i * 0.1}s`}} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 md:py-20 px-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 via-background to-background dark:from-slate-800/30"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16">
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">MyPortfolio</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">The future of portfolios</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed mb-6 sm:mb-8">
                The ultimate tool for modern professionals to showcase their work and build their personal brand.
              </p>
              
              {/* Social links with enhanced styling */}
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Follow us:</span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Link href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-emerald-500/25">
                    <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors" />
                  </Link>
                  <Link href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-emerald-500/25">
                    <Github className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors" />
                  </Link>
                  <Link href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-emerald-500/25">
                    <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Product</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li><Link href="#features" className="text-sm sm:text-base text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Features
                </Link></li>
                <li><Link href="#" className="text-sm sm:text-base text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Templates
                </Link></li>
                <li><Link href="#" className="text-sm sm:text-base text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Pricing
                </Link></li>
                <li><Link href="#" className="text-sm sm:text-base text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  API
                </Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Connect</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li><Link href="#" className="text-sm sm:text-base text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  About Us
                </Link></li>
                <li><Link href="#" className="text-sm sm:text-base text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Contact
                </Link></li>
                <li><Link href="#" className="text-sm sm:text-base text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Blog
                </Link></li>
                <li><Link href="#" className="text-sm sm:text-base text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Support
                </Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 MyPortfolio. All rights reserved. Made with ❤️ for creators.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300">Privacy Policy</Link>
              <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300">Terms of Service</Link>
              <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}