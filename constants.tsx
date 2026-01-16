
import React from 'react';
import { Project, Service } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'elearning',
    title: 'Global E-learning Platform',
    description: 'Engineered the frontend of a large-scale education platform for 2.5 million+ learners.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'Framer Motion'],
    metrics: [
      '2.5M+ active users',
      '30% improvement in load times',
      'Increased engagement by 20% through UX optimizations'
    ]
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Web App Overhaul',
    description: 'Revamped a legacy e-commerce site with Next.js and modern UI components, integrating Stripe.',
    techStack: ['React', 'Next.js', 'Stripe API', 'shadcn/ui', 'PostgreSQL'],
    metrics: [
      'Modern component architecture',
      'Seamless multi-payment integration',
      '50% faster checkout flow'
    ]
  },
  {
    id: 'logistics',
    title: 'Real-time Logistics Dashboard',
    description: 'Handles 5,000+ daily operations and ~1,000 concurrent users with real-time data visualization.',
    techStack: ['React', 'Socket.io', 'D3.js', 'Node.js', 'TypeScript'],
    metrics: [
      '60% reduction in data latency',
      'Real-time tracking of 5k+ assets',
      'Built-in predictive analytics view'
    ]
  },
  {
    id: 'admin-crm',
    title: 'Enterprise Admin Dashboard',
    description: 'Internal tools managing 10k+ records with automated workflows to cut manual operations.',
    techStack: ['React', 'TanStack Query', 'Tailwind', 'Chart.js'],
    metrics: [
      '50% less manual data entry',
      'Managed 10,000+ customer records',
      'Automated 12 core business workflows'
    ]
  }
];

export const SERVICES: Service[] = [
  {
    id: 'ui-dev',
    title: 'Interactive UI Development',
    description: 'Fluid, Responsive UI Development – Building interfaces with React/TypeScript and Tailwind that feel smooth on every device.',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
  },
  {
    id: 'motion-webgl',
    title: 'Advanced Animations & WebGL',
    description: 'Crafting standout experiences with Framer Motion, GSAP, and Three.js for that extra wow-factor.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    id: 'architecture',
    title: 'Scalable Architecture',
    description: 'Designing component systems and state management that grow with your product, reducing bugs and speeding development.',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  },
  {
    id: 'performance',
    title: 'Performance Optimization',
    description: 'Optimizing for speed and load times, achieving 20-40% faster page loads in production environments.',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  }
];
