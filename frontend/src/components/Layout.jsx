import React from 'react';
import Button from './Button';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary selection:text-white">
      
      {/* Clean, high-contrast Header */}
      <header className="px-8 py-6 border-b border-border-light bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Thin accent usage on the period */}
          <h1 className="text-2xl font-bold tracking-tight">CleanTech<span className="text-primary">.</span></h1>
          <nav className="flex gap-8 items-center">
            <a href="#" className="text-text-muted hover:text-primary transition-colors font-medium">Features</a>
            <a href="#" className="text-text-muted hover:text-primary transition-colors font-medium">Pricing</a>
            <Button variant="primary">Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Main Content Area with generous vertical breathing room */}
      <main className="max-w-7xl mx-auto px-8 py-20 sm:py-32 space-y-32">
        
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-8">
          <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight text-text-main tracking-tight">
            Innovating the Future of <span className="text-primary">Clean Technology</span>
          </h2>
          <p className="text-xl text-text-muted leading-relaxed max-w-2xl mx-auto">
            Build sustainable, scalable, and beautiful applications with our industry-leading platform. Prioritizing simplicity and uncompromised performance.
          </p>
          <div className="flex justify-center gap-4 pt-6">
            <Button variant="primary">Start Free Trial</Button>
            <Button variant="outline">View Documentation</Button>
          </div>
        </section>

        {/* Surface Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            // Using the surface color and soft shadows for secondary blocks
            <div key={item} className="bg-surface p-10 rounded-3xl border border-border-light shadow-soft hover:-translate-y-1 transition-transform duration-300">
              
              {/* Icon placeholder using a stark white block to pop off the surface gray */}
              <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center shadow-sm mb-8 border border-border-light">
                <span className="text-primary text-xl font-bold">{item}</span>
              </div>
              
              <h3 className="text-xl font-bold text-text-main mb-4">Core Feature {item}</h3>
              <p className="text-text-muted leading-relaxed">
                This is a subtle feature block utilizing the surface background color, soft diffused shadows, and clean typography.
              </p>
            </div>
          ))}
        </section>

        {children}
      </main>
    </div>
  );
}