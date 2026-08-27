-- First insert profiles for each creator
INSERT INTO profiles (user_id, email, role, full_name, onboarding_completed) VALUES
('creator_001', 'maya.rodriguez@email.com', 'creator', 'Maya Rodriguez', true),
('creator_002', 'alex.chen@email.com', 'creator', 'Alex Chen', true),
('creator_003', 'sarah.johnson@email.com', 'creator', 'Sarah Johnson', true),
('creator_004', 'marcus.wright@email.com', 'creator', 'Marcus Wright', true),
('creator_005', 'priya.sharma@email.com', 'creator', 'Priya Sharma', true),
('creator_006', 'jordan.taylor@email.com', 'creator', 'Jordan Taylor', true),
('creator_007', 'emma.davis@email.com', 'creator', 'Emma Davis', true),
('creator_008', 'kai.nakamura@email.com', 'creator', 'Kai Nakamura', true),
('creator_009', 'olivia.brown@email.com', 'creator', 'Olivia Brown', true),
('creator_010', 'lucas.martin@email.com', 'creator', 'Lucas Martin', true),
('creator_011', 'zoe.williams@email.com', 'creator', 'Zoe Williams', true),
('creator_012', 'noah.garcia@email.com', 'creator', 'Noah Garcia', true)
ON CONFLICT (user_id) DO NOTHING;

-- Then insert creator_profiles with varied data
INSERT INTO creator_profiles (user_id, username, bio, categories, follower_count, avatar_url, social_links) VALUES
('creator_001', 'mayacreates', 'Beauty & lifestyle creator. 3 years UGC experience. Worked with Glossier, Fenty, Rare Beauty.', ARRAY['Beauty', 'Lifestyle'], 125000, 'https://ui-avatars.com/api/?name=Maya+R&background=E0F5FF&color=202020&size=128', '{"tiktok":"https://tiktok.com/@mayacreates","instagram":"https://instagram.com/mayacreates"}'),
('creator_002', 'alextechtok', 'Tech reviewer & unboxing specialist. 500+ brand collabs. Clean aesthetic, fast turnaround.', ARRAY['Tech', 'Gaming'], 340000, 'https://ui-avatars.com/api/?name=Alex+C&background=DBEAFE&color=1E40AF&size=128', '{"tiktok":"https://tiktok.com/@alextechtok","youtube":"https://youtube.com/@alextechtok"}'),
('creator_003', 'sarahfitlife', 'Fitness & wellness content creator. Certified PT. Authentic, high-energy delivery.', ARRAY['Fitness', 'Lifestyle'], 89000, 'https://ui-avatars.com/api/?name=Sarah+J&background=D1FAE5&color=065F46&size=128', '{"tiktok":"https://tiktok.com/@sarahfitlife","instagram":"https://instagram.com/sarahfitlife"}'),
('creator_004', 'marcuseats', 'Food & cooking content. Restaurant reviews and recipe videos. Based in NYC.', ARRAY['Food', 'Lifestyle'], 210000, 'https://ui-avatars.com/api/?name=Marcus+W&background=FEF3C7&color=92400E&size=128', '{"tiktok":"https://tiktok.com/@marcuseats","instagram":"https://instagram.com/marcuseats"}'),
('creator_005', 'priyastyle', 'Fashion & beauty. South Asian representation in UGC. Clean, editorial aesthetic.', ARRAY['Fashion', 'Beauty'], 156000, 'https://ui-avatars.com/api/?name=Priya+S&background=FCE7F3&color=9D174D&size=128', '{"instagram":"https://instagram.com/priyastyle","tiktok":"https://tiktok.com/@priyastyle"}'),
('creator_006', 'jordangaming', 'Full-time gaming creator. Specializing in mobile game ads and gameplay content.', ARRAY['Gaming', 'Tech'], 430000, 'https://ui-avatars.com/api/?name=Jordan+T&background=EDE9FE&color=5B21B6&size=128', '{"tiktok":"https://tiktok.com/@jordangaming","youtube":"https://youtube.com/@jordangaming"}'),
('creator_007', 'emmaparents', 'Parenting & family lifestyle. Relatable mom content. Brand-safe and authentic.', ARRAY['Lifestyle', 'Beauty'], 67000, 'https://ui-avatars.com/api/?name=Emma+D&background=FFEDD5&color=9A3412&size=128', '{"instagram":"https://instagram.com/emmaparents"}'),
('creator_008', 'kaitravel', 'Travel & adventure content. Drone footage, cinematic edits. Based in LA.', ARRAY['Travel', 'Lifestyle'], 290000, 'https://ui-avatars.com/api/?name=Kai+N&background=CFFAFE&color=155E75&size=128', '{"tiktok":"https://tiktok.com/@kaitravel","youtube":"https://youtube.com/@kaitravel","instagram":"https://instagram.com/kaitravel"}'),
('creator_009', 'oliviawellness', 'Wellness, skincare, and self-care routines. Calm aesthetic. 2 years UGC.', ARRAY['Beauty', 'Lifestyle'], 98000, 'https://ui-avatars.com/api/?name=Olivia+B&background=E0F5FF&color=0C4A6E&size=128', '{"instagram":"https://instagram.com/oliviawellness","tiktok":"https://tiktok.com/@oliviawellness"}'),
('creator_010', 'lucasfinance', 'Personal finance & fintech content. Makes complex topics simple and engaging.', ARRAY['Finance', 'Tech'], 175000, 'https://ui-avatars.com/api/?name=Lucas+M&background=DBEAFE&color=1E3A8A&size=128', '{"tiktok":"https://tiktok.com/@lucasfinance","youtube":"https://youtube.com/@lucasfinance"}'),
('creator_011', 'zoelifestyle', 'Gen Z lifestyle creator. Trending sounds, fast edits, high engagement.', ARRAY['Lifestyle', 'Fashion'], 520000, 'https://ui-avatars.com/api/?name=Zoe+W&background=FCE7F3&color=831843&size=128', '{"tiktok":"https://tiktok.com/@zoelifestyle","instagram":"https://instagram.com/zoelifestyle"}'),
('creator_012', 'noahoutdoors', 'Outdoor adventure & fitness. Rock climbing, hiking, camping gear reviews.', ARRAY['Fitness', 'Travel'], 143000, 'https://ui-avatars.com/api/?name=Noah+G&background=D1FAE5&color=064E3B&size=128', '{"tiktok":"https://tiktok.com/@noahoutdoors","instagram":"https://instagram.com/noahoutdoors","youtube":"https://youtube.com/@noahoutdoors"}')
ON CONFLICT (user_id) DO NOTHING;
