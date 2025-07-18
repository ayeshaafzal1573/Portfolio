-- Create live_projects table for slider section
CREATE TABLE IF NOT EXISTS live_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(500) NOT NULL,
  live_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categorized_projects table for card section
CREATE TABLE IF NOT EXISTS categorized_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Full-Stack', 'Frontend', 'Mobile App', 'UI/UX')),
  tech_stack TEXT[] NOT NULL,
  demo_url VARCHAR(500),
  github_url VARCHAR(500),
  image_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table for form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE live_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorized_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to live projects" ON live_projects
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to featured categorized projects" ON categorized_projects
  FOR SELECT USING (is_featured = true);

-- Create policy for inserting contact submissions
CREATE POLICY "Allow public insert to contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Insert sample live projects data
INSERT INTO live_projects (name, thumbnail_url, live_url) VALUES
('E-Commerce Dashboard', '/placeholder.svg?height=200&width=300', 'https://example.com'),
('Task Management App', '/placeholder.svg?height=200&width=300', 'https://example.com'),
('Portfolio Website', '/placeholder.svg?height=200&width=300', 'https://example.com'),
('Social Media Platform', '/placeholder.svg?height=200&width=300', 'https://example.com'),
('Analytics Dashboard', '/placeholder.svg?height=200&width=300', 'https://example.com');

-- Update the category constraint
ALTER TABLE categorized_projects DROP CONSTRAINT IF EXISTS categorized_projects_category_check;
ALTER TABLE categorized_projects ADD CONSTRAINT categorized_projects_category_check 
  CHECK (category IN ('MERN Stack', 'Full-Stack', 'Mobile Apps', 'UI/UX Designs'));

-- Clear existing data and insert new sample data
DELETE FROM categorized_projects;

INSERT INTO categorized_projects (title, description, category, tech_stack, demo_url, github_url, image_url, is_featured) VALUES
('E-Commerce MERN Platform', 'Full-stack e-commerce solution built with MongoDB, Express, React, and Node.js. Features include user authentication, payment integration, and admin dashboard.', 'MERN Stack', ARRAY['MongoDB', 'Express.js', 'React', 'Node.js', 'Stripe'], '#', '#', '/placeholder.svg?height=300&width=400', true),
('Task Management MERN App', 'Collaborative project management tool with real-time updates, team collaboration, and advanced analytics using the MERN stack.', 'MERN Stack', ARRAY['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io'], '#', '#', '/placeholder.svg?height=300&width=400', true),
('Supabase Analytics Dashboard', 'Modern analytics platform built with Supabase backend, featuring real-time data visualization and user management.', 'Full-Stack', ARRAY['Next.js', 'Supabase', 'TypeScript', 'Chart.js'], '#', '#', '/placeholder.svg?height=300&width=400', true),
('FastAPI Backend Service', 'High-performance REST API built with FastAPI, featuring automatic documentation, authentication, and database integration.', 'Full-Stack', ARRAY['FastAPI', 'PostgreSQL', 'Docker', 'Redis'], '#', '#', '/placeholder.svg?height=300&width=400', true),
('React Native Fitness App', 'Cross-platform mobile app for tracking workouts, nutrition, and health metrics with offline capabilities.', 'Mobile Apps', ARRAY['React Native', 'Expo', 'Firebase', 'Redux'], '#', '#', '/placeholder.svg?height=300&width=400', true),
('E-Learning Mobile App', 'Educational mobile application with video streaming, progress tracking, and interactive quizzes built with React Native.', 'Mobile Apps', ARRAY['React Native', 'Node.js', 'MongoDB', 'AWS S3'], '#', '#', '/placeholder.svg?height=300&width=400', true),
('Banking App UI/UX Design', 'Complete design system for a modern banking application with user research, wireframes, and interactive prototypes.', 'UI/UX Designs', ARRAY['Figma', 'Adobe XD', 'Principle', 'InVision'], '#', '#', '/placeholder.svg?height=300&width=400', true),
('SaaS Dashboard Design', 'Modern SaaS dashboard design with clean interface, data visualization components, and responsive layouts.', 'UI/UX Designs', ARRAY['Figma', 'Sketch', 'Framer', 'Zeplin'], '#', '#', '/placeholder.svg?height=300&width=400', true);
