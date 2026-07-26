-- ============================================================
-- PROFILES TABLE (Hero Section - Singleton)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'Ayesha Afzal',
  intro_label VARCHAR(255) DEFAULT 'Hi, My Name Is',
  subtitle VARCHAR(500) DEFAULT '',
  description TEXT DEFAULT '',
  cta_text VARCHAR(255) DEFAULT 'Let''s Build Together',
  profile_image TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TYPING_ROLES TABLE (Hero typing animation roles)
-- ============================================================
CREATE TABLE IF NOT EXISTS typing_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role VARCHAR(255) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ABOUT TABLE (About Section - Singleton)
-- ============================================================
CREATE TABLE IF NOT EXISTS about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TIMELINE_ENTRIES TABLE (Professional Journey)
-- ============================================================
CREATE TABLE IF NOT EXISTS timeline_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SKILLS TABLE (Core Skills)
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  level INTEGER DEFAULT 75 CHECK (level >= 0 AND level <= 100),
  icon VARCHAR(100) DEFAULT 'Code',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- EDUCATION_ENTRIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS education_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  degree VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  grade VARCHAR(100) DEFAULT '',
  description TEXT DEFAULT '',
  badges TEXT[] DEFAULT '{}',
  icon VARCHAR(100) DEFAULT 'GraduationCap',
  color VARCHAR(50) DEFAULT 'var(--accent-primary)',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- LIVE_PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS live_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(500) DEFAULT '',
  live_url VARCHAR(500) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CATEGORIZED_PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS categorized_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  category VARCHAR(50) NOT NULL DEFAULT 'Full-Stack',
  tech_stack TEXT[] DEFAULT '{}',
  demo_url VARCHAR(500) DEFAULT '',
  github_url VARCHAR(500) DEFAULT '',
  image_url VARCHAR(500) DEFAULT '',
  video_url VARCHAR(500) DEFAULT '',
  is_featured BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CONTACT_INFO TABLE (Contact Section - Singleton)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) DEFAULT '',
  phone VARCHAR(100) DEFAULT '',
  heading VARCHAR(255) DEFAULT 'Let''s Work Together',
  subtitle TEXT DEFAULT '',
  resume_url VARCHAR(500) DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SOCIAL_LINKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(500) NOT NULL,
  label VARCHAR(100) DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CONTACT_SUBMISSIONS TABLE (Form Submissions)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SITE_SETTINGS TABLE (Navbar + Footer - Singleton)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name VARCHAR(255) DEFAULT 'Ayesha.',
  footer_text VARCHAR(500) DEFAULT '© 2026 Ayesha Afzal. Crafting digital experiences with passion.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- THEME_SETTINGS TABLE (Theme Colors - Singleton)
-- ============================================================
CREATE TABLE IF NOT EXISTS theme_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  theme JSONB NOT NULL DEFAULT '{
    "pastel": {
      "primaryColor": "#d946ef",
      "secondaryColor": "#a855f7",
      "backgroundColor": "#faf5ff",
      "textColor": "#3b0764",
      "accentColor": "#d946ef"
    },
    "dark": {
      "primaryColor": "#38bdf8",
      "secondaryColor": "#22d3ee",
      "backgroundColor": "#0b1220",
      "textColor": "#e2e8f0",
      "accentColor": "#38bdf8"
    },
    "girly-blue": {
      "primaryColor": "#2563eb",
      "secondaryColor": "#0284c7",
      "backgroundColor": "#f2f7ff",
      "textColor": "#172554",
      "accentColor": "#2563eb"
    }
  }'::JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Seed profiles
INSERT INTO profiles (id, name, intro_label, subtitle, description, cta_text)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Ayesha Afzal',
  'Hi, My Name Is',
  'Full-Stack Software Engineer & UI/UX Designer',
  'Specialized in engineering robust architectures using the MERN Stack, Next.js, FastAPI, and cross-platform mobile apps with React Native. Seamlessly merging clean aesthetics with modern performance practices.',
  'Let''s Build Together'
)
ON CONFLICT (id) DO NOTHING;

-- Seed typing roles
INSERT INTO typing_roles (role, sort_order) VALUES
  ('Full-Stack Software Engineer', 0),
  ('MERN Stack Specialist', 1),
  ('Next.js Architect', 2),
  ('React Native Developer', 3),
  ('UI/UX Designer', 4)
ON CONFLICT DO NOTHING;

-- Seed about
INSERT INTO about (id, description)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Full-Stack Developer & UI/UX Designer with 2+ years of experience building modern web and mobile applications. Specialized in scalable eCommerce platforms, admin dashboards, and intuitive user interfaces using MERN, Next.js, React Native, and FastAPI.'
)
ON CONFLICT (id) DO NOTHING;

-- Seed timeline entries
INSERT INTO timeline_entries (year, title, description, skills, sort_order) VALUES
  ('Present', 'Full-Stack Developer @ Asani.io', 'Working as a Full-Stack Developer with a strong focus on backend architecture. Responsibilities include routing and APIs using Fastify, database management with PostgreSQL, implementing unified CI/CD pipelines via Jenkins, and monitoring cloud logs.', ARRAY['Fastify', 'PostgreSQL', 'CI/CD', 'Jenkins', 'Cloud Logs'], 0),
  ('2025', 'Full-Stack Developer & UI/UX Designer', 'Building scalable eCommerce platforms using Next.js, FastAPI, and MongoDB. Focused on luxury jewelry business solutions, integrating admin panels, product management, and user interfaces.', ARRAY['Next.js', 'FastAPI', 'MongoDB', 'UI/UX Design'], 1),
  ('2024', 'React Native Developer', 'Developed multi-role mobile applications using Expo Router, Supabase, and Zustand for educational and content-based platforms.', ARRAY['React Native', 'Expo Router', 'Supabase', 'Zustand'], 2),
  ('2023', 'Full-Stack Developer (MERN Stack)', 'Created hotel management and inventory systems using React, Node.js, Express, and MongoDB with custom UI components.', ARRAY['React', 'Node.js', 'Express', 'MongoDB'], 3),
  ('2022', 'Frontend Developer & UI/UX Designer', 'Designed modern web layouts and interfaces using Figma and Adobe XD while developing frontend projects with React.js and Tailwind CSS.', ARRAY['React.js', 'Tailwind CSS', 'Figma', 'Adobe XD'], 4);

-- Seed skills
INSERT INTO skills (name, level, icon, sort_order) VALUES
  ('Frontend Development', 100, 'Code', 0),
  ('Backend Development', 88, 'Database', 1),
  ('UI/UX Design', 100, 'Palette', 2),
  ('Mobile Development', 92, 'Smartphone', 3),
  ('eCommerce Systems', 90, 'Globe', 4),
  ('Modern Frameworks', 94, 'Zap', 5),
  ('IoT & Real-Time Systems', 85, 'Radio', 6),
  ('DevOps & Monitoring', 82, 'BarChart2', 7),
  ('Auth & API Security', 87, 'ShieldCheck', 8),
  ('Teaching & Mentoring', 88, 'Users', 9);

-- Seed education entries
INSERT INTO education_entries (degree, institution, duration, grade, description, badges, icon, color, sort_order) VALUES
  ('Bachelors in Computer Science', 'Virtual University of Pakistan', '2026 - Present', 'Pursuing', 'Focusing on advanced algorithms, software engineering principles, database management systems, and discrete mathematics.', ARRAY['Computer Science', 'Software Architecture', 'AI Foundations'], 'GraduationCap', 'var(--accent-primary)', 0),
  ('Diploma in Software Engineering', 'Aptech Computer Education', '2022 - 2025', 'A+ Grade', 'Rigorous curriculum encompassing full-stack web architectures, enterprise application design, API development, and object-oriented programming.', ARRAY['MERN Stack', 'C# .NET', 'SQL Server', 'Web APIs'], 'Award', 'var(--accent-secondary)', 1),
  ('Intermediate', 'Technical Board (Through Aptech)', '2022 - 2024', 'Completed', 'Acquired critical foundations in computer sciences, mathematics, and logic through specialized vocational board tracks.', ARRAY['Technical Sciences', 'Applied Mathematics'], 'BookOpen', 'var(--accent-primary)', 2),
  ('Matriculation (Computer Science)', 'The Educators School', '2008 - 2022', 'Grade A', 'Primary and secondary education laying down core foundations in science, physics, mathematics, and introduction to computer programming.', ARRAY['General Science', 'Elementary Programming'], 'MapPin', 'var(--accent-secondary)', 3);

-- Seed live projects
INSERT INTO live_projects (name, thumbnail_url, live_url, sort_order) VALUES
  ('KWSC Unified App', '/kwsc.png?height=200&width=300', 'https://play.google.com/store/apps/details?id=pk.gov.kwsc.kwsc_digital&hl=en', 0),
  ('Asani Website', '/web.png?height=200&width=300', 'https://asani-website.vercel.app/', 1),
  ('Trippy', '/3.png?height=200&width=300', 'https://trippy-website-two.vercel.app/', 2),
  ('Plant Palace', '/4.png?height=200&width=300', 'https://plant-palace-techarmy.netlify.app/', 3),
  ('Hotel Management System', '/hms.png?height=200&width=300', 'https://luxurystay-hms.vercel.app/', 4);

-- Seed categorized projects
INSERT INTO categorized_projects (title, description, category, tech_stack, demo_url, github_url, video_url, is_featured, sort_order) VALUES
  ('SMF-Jewels', 'Discover the finest collection of handcrafted luxury jewelry. Each piece tells a story of elegance, craftsmanship, and timeless beauty.', 'Full-Stack', ARRAY['MongoDB', 'Express.js', 'React', 'Node.js'], 'https://smf-jewels.vercel.app/', '#', '/SMFJEWELS.webm', true, 0),
  ('Luxury Stay', 'Indulge in comfort, elegance, and world-class service. Your perfect stay begins here!', 'MERN Stack', ARRAY['MongoDB', 'Express.js', 'React', 'Node.js'], 'https://luxurystay-hms.vercel.app', '#', '/LuxuryStay.mp4', true, 1),
  ('Trippy', 'A platform that solves all tour related problems being faced by users, tour agencies or individual tour guides comparably!', 'Full-Stack', ARRAY['Vue JS', 'Firebase', 'Express', 'Node.js'], 'https://trippy-website-two.vercel.app/', '#', '/trippy.mp4', true, 2),
  ('Yummy Pet Palate', 'Your go-to e-commerce destination for delectable pet food, catering to your furry friend''s taste and health needs.', 'Full-Stack', ARRAY['PHP', 'MYSQL', 'Bootstrap', 'JQUERY'], 'https://projects.sunaina.codes/ypp/index.php', '#', '/YummyPetPalate.mp4', true, 3),
  ('Pandemix', 'Your comprehensive online hospital management system for efficient COVID testing. Streamline processes, enhance patient care, and ensure a safer healthcare experience.', 'Full-Stack', ARRAY['PHP', 'MYSQL', 'Bootstrap', 'JQUERY'], 'https://projects.sunaina.codes/pandemix', '#', '/Pandemix.mp4', true, 4),
  ('Institute Of Fine Arts', 'Empowering artistic visions through education and innovation at the Institute of Fine Arts. Join our creative community today.', 'Full-Stack', ARRAY['ASP.NET', 'SQL Server', 'Bootstrap'], '#', '#', '/InstituteofFineArts.mp4', true, 5),
  ('Gem Elegance', 'Explore Gem Elegance, your premier online destination for exquisite men''s and women''s jewelry. Discover timeless pieces, unparalleled craftsmanship, and unmatched elegance.', 'Full-Stack', ARRAY['Laravel', 'MYSQL', 'Bootstrap'], 'https://www.linkedin.com/posts/ayeshaafzalqadir_laravel-ecommerce-webdevelopment-activity-7228390172533415936-DHsi', '#', '/GemElegance.mp4', true, 6),
  ('Baby Shop Hub', 'Your go-to e-commerce destination for delectable baby food, catering to your baby health needs.', 'Full-Stack', ARRAY['Flutter', 'Laravel', 'MYSQL'], 'https://www.linkedin.com/posts/ayeshaafzalqadir_mobileappdevelopment-flutter-laravel-activity-7256033227704811522-JAEG', '#', '/BabyShopHub.mp4', true, 7),
  ('Aligarh Institute of Technology', 'I''ve developed an ERP app for Aligarh Institute of Technology using React Native.', 'Mobile Apps', ARRAY['React Native', 'Firebase'], 'https://www.linkedin.com/posts/ayeshaafzalqadir_reactnative-edtech-erpdevelopment-activity-7281908979293708288-DF23', '#', '/Aligarh.mp4', true, 8),
  ('Taverna', 'Taverna—a modern mobile app designed in react native to revolutionize your bar-hopping experience.', 'Mobile Apps', ARRAY['React Native', 'Node.js', 'MongoDB'], 'https://www.linkedin.com/posts/ayeshaafzalqadir_mobileappdevelopment-tavernaapp-innovation-activity-7284941587606884352-GpZZ', '#', '/Taverna.mp4', true, 9),
  ('The Groove Fest', 'Immerse yourself in music with a website that offers songs and tickets for concerts, creating unforgettable experiences.', 'Web Development', ARRAY['HTML', 'CSS', 'JavaScript'], 'https://thegroovefest.netlify.app', '#', '/TheGrooveFest.mp4', true, 10),
  ('Apptrix Technologies', 'It is a Digital Agency Website.', 'Web Development', ARRAY['HTML', 'CSS', 'JavaScript'], 'https://apptrixtechnologies.com/', '#', '/Apptrix.mp4', true, 11),
  ('Inventory System', 'It is a Inventory System designed for PECT Engineering.', 'Web Development', ARRAY['React', 'Node.js', 'MongoDB'], 'https://inventory-frontend-livid.vercel.app/', '#', '/Inventory.mp4', true, 12),
  ('Plant Palace', 'Your online plant emporium for purchasing a diverse range of green companions and botanical delights.', 'Web Development', ARRAY['HTML', 'CSS', 'JavaScript'], 'https://plant-palace-techarmy.netlify.app/', '#', '/PlantPalace.mp4', true, 13),
  ('Ruya Airline', 'A premier airline website, offering exceptional travel services and a world of destinations.', 'Web Development', ARRAY['HTML', 'CSS', 'JavaScript'], 'https://ruyaairlines.netlify.app/', '#', '/RuyaAirlines.mp4', true, 14),
  ('Wilson Sporting Goods', 'Your source for top-notch sports gear, delivering excellence in equipment and accessories for athletes of all levels.', 'Web Development', ARRAY['HTML', 'CSS', 'JavaScript'], 'https://wilsonsportinggoods.netlify.app/', '#', '/WilsonSportingGoods.mp4', true, 15),
  ('SA Clothing', 'Your ultimate online fashion destination, showcasing a trendy collection of clothing for every style and occasion.', 'Web Development', ARRAY['HTML', 'CSS', 'JavaScript'], 'https://saclothing.netlify.app/', '#', '/SAClothing.mp4', true, 16),
  ('KWSC Unified App', 'KWSC Unified App lets you access all water-related services in one place.', 'Full-Stack', ARRAY['Fastify', 'PostgreSQL', 'Node JS'], 'https://play.google.com/store/apps/details?id=pk.gov.kwsc.kwsc_digital&hl=en', '#', '/kwsc.png', '', true, 17),
  ('Asani Dashboard', 'Asani Dashboard is a comprehensive web application designed to provide users with real-time insights and analytics for their projects.', 'Full-Stack', ARRAY['Redis', 'PostgreSQL', 'Node JS'], 'asani.io', '#', '/asani-dashboard.png', '', true, 18),
  ('Asani Website', 'Asani Website is a modern web application designed to provide users with a seamless and intuitive experience.', 'Full-Stack', ARRAY['Next.js', 'Node JS'], 'https://asani-website.vercel.app/', '#', '/web.png', '', true, 19);

-- Seed contact info
INSERT INTO contact_info (id, email, phone, heading, subtitle, resume_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'ayeshaafzal1573@gmail.com',
  '',
  'Let''s Work Together',
  'Ready to bring your ideas to life? Let''s discuss your project and create something outstanding together.',
  'https://drive.google.com/file/d/1GGuBWHrTkwG982hPpZNWLrSMPMc7qOoA/view?usp=sharing'
)
ON CONFLICT (id) DO NOTHING;

-- Seed social links
INSERT INTO social_links (platform, url, label, sort_order) VALUES
  ('github', 'https://github.com/ayeshaafzal1573', 'GitHub', 0),
  ('linkedin', 'https://www.linkedin.com/in/ayeshaafzalqadir/', 'LinkedIn', 1),
  ('behance', 'https://www.behance.net/ayeshaafzal14', 'Behance', 2);

-- Seed site settings
INSERT INTO site_settings (id, brand_name, footer_text)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Ayesha.',
  '© 2026 Ayesha Afzal. Crafting digital experiences with passion.'
)
ON CONFLICT (id) DO NOTHING;

-- Seed theme settings
INSERT INTO theme_settings (id, theme)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '{
    "pastel": {
      "primaryColor": "#d946ef",
      "secondaryColor": "#a855f7",
      "backgroundColor": "#faf5ff",
      "textColor": "#3b0764",
      "accentColor": "#d946ef"
    },
    "dark": {
      "primaryColor": "#38bdf8",
      "secondaryColor": "#22d3ee",
      "backgroundColor": "#0b1220",
      "textColor": "#e2e8f0",
      "accentColor": "#38bdf8"
    },
    "girly-blue": {
      "primaryColor": "#2563eb",
      "secondaryColor": "#0284c7",
      "backgroundColor": "#f2f7ff",
      "textColor": "#172554",
      "accentColor": "#2563eb"
    }
  }'::JSONB
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorized_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read typing_roles" ON typing_roles FOR SELECT USING (true);
CREATE POLICY "Allow public read about" ON about FOR SELECT USING (true);
CREATE POLICY "Allow public read timeline_entries" ON timeline_entries FOR SELECT USING (true);
CREATE POLICY "Allow public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read education_entries" ON education_entries FOR SELECT USING (true);
CREATE POLICY "Allow public read live_projects" ON live_projects FOR SELECT USING (true);
CREATE POLICY "Allow public read categorized_projects" ON categorized_projects FOR SELECT USING (true);
CREATE POLICY "Allow public read contact_info" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Allow public read social_links" ON social_links FOR SELECT USING (true);
CREATE POLICY "Allow public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read theme_settings" ON theme_settings FOR SELECT USING (true);

-- Public insert/update policies (admin writes)
CREATE POLICY "Allow public insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update profiles" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Allow public insert typing_roles" ON typing_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update typing_roles" ON typing_roles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete typing_roles" ON typing_roles FOR DELETE USING (true);
CREATE POLICY "Allow public insert timeline_entries" ON timeline_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update timeline_entries" ON timeline_entries FOR UPDATE USING (true);
CREATE POLICY "Allow public delete timeline_entries" ON timeline_entries FOR DELETE USING (true);
CREATE POLICY "Allow public insert skills" ON skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update skills" ON skills FOR UPDATE USING (true);
CREATE POLICY "Allow public delete skills" ON skills FOR DELETE USING (true);
CREATE POLICY "Allow public insert education_entries" ON education_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update education_entries" ON education_entries FOR UPDATE USING (true);
CREATE POLICY "Allow public delete education_entries" ON education_entries FOR DELETE USING (true);
CREATE POLICY "Allow public insert live_projects" ON live_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update live_projects" ON live_projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete live_projects" ON live_projects FOR DELETE USING (true);
CREATE POLICY "Allow public insert categorized_projects" ON categorized_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update categorized_projects" ON categorized_projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete categorized_projects" ON categorized_projects FOR DELETE USING (true);
CREATE POLICY "Allow public insert contact_info" ON contact_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update contact_info" ON contact_info FOR UPDATE USING (true);
CREATE POLICY "Allow public insert social_links" ON social_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update social_links" ON social_links FOR UPDATE USING (true);
CREATE POLICY "Allow public delete social_links" ON social_links FOR DELETE USING (true);
CREATE POLICY "Allow public insert contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read contact_submissions" ON contact_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert site_settings" ON site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update site_settings" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public insert theme_settings" ON theme_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update theme_settings" ON theme_settings FOR UPDATE USING (true);
